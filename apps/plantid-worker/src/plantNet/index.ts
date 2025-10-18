import axios, { type AxiosError } from "axios"
import { loadImageBySize } from "jazz-tools/media"
import config from "../config.ts"
import { logError } from "../lib/axiosErrorHandling.ts"
import logger from "../logger.ts"
import { type PlantNetResponse } from "./types"

const RESULTS_TO_REQUEST = 3

// PlantNet resizes images to "a maximum of 1280px on the large side".
// Minimum size should be 800x800px.
// https://my.plantnet.org/doc/getting-started/faq#input-data
const MAX_IMAGE_WIDTH = 1280
const MAX_IMAGE_HEIGHT = 1280

const client = axios.create({
  baseURL: config.plantNetApi,
  timeout: 30000, // milliseconds (30 sec)
  headers: {
    "User-Agent": "LocalPlants ID Worker",
  },
  // // max size of the http response content in bytes
  // maxContentLength: 2000,
  // //  max size of the http request content in bytes
  // maxBodyLength: 2000,
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const axiosError = error as AxiosError
    logError(axiosError)
    return Promise.reject(axiosError)
  }
)

export async function plantNetIdentityRequest({
  imageId,
}: {
  imageId: string
}) {
  const image = await loadImageBySize(
    imageId,
    MAX_IMAGE_WIDTH,
    MAX_IMAGE_HEIGHT
  )

  if (!image) {
    throw new Error(`Failed to resolve image for ID "${imageId}".`)
  }

  logger.debug("Preparing request data.")
  const formData = new FormData()
  formData.append("images", image.image.toBlob())

  logger.debug("Executing PlantNet request.")
  return request(formData)
}

function request(formData: FormData) {
  return client.postForm<PlantNetResponse>("/v2/identify/all", formData, {
    params: {
      "api-key": config.plantNetApiKey,
      "include-related-images": true,
      "no-reject": true,
      "nb-results": RESULTS_TO_REQUEST,
      "type": "kt",
      "detailed": true,
    },
  })
}

export interface PlantNetRateLimit {
  resetInSeconds: number
  remainingRequests: number
}

export function parseRateLimitHeader(
  value: string
): PlantNetRateLimit | undefined {
  const parts = value.split("")
  const remainingValue = parts[1]
  const resetValue = parts[2]

  if (!remainingValue || !resetValue) return

  const remainingRequests = parseInt(remainingValue.split("=")[1] ?? "0", 10)
  const resetInSeconds = parseInt(resetValue.split("=")[1] ?? "0", 10)

  return { resetInSeconds, remainingRequests }
}
