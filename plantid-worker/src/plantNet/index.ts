import axios, { type AxiosResponse, type AxiosResponseHeaders } from 'axios'
import { loadImageBySize } from 'jazz-tools/media'
import config from '../config.js'
import { logError } from '../lib/axiosErrorHandling.js'
import logger from '../logger.js'
import type { PlantNetResponse } from './types.js'

// PlantNet resizes images to "a maximum of 1280px on the large side".
// Minimum size should be 800x800px.
// https://my.plantnet.org/doc/getting-started/faq#input-data
const MAX_IMAGE_WIDTH = 1280
const MAX_IMAGE_HEIGHT = 1280

const client = axios.create({
  baseURL: config.plantNetApi,
  timeout: 30000, // milliseconds (30 sec)
  headers: {
    'User-Agent': 'LocalPlants ID Worker',
  },
  // // max size of the http response content in bytes
  // maxContentLength: 2000,
  // //  max size of the http request content in bytes
  // maxBodyLength: 2000,
})

export async function plantNetIdentityRequest({
  imageId,
}: {
  imageId: string
}) {
  const image = await loadImageBySize(
    imageId,
    MAX_IMAGE_WIDTH,
    MAX_IMAGE_HEIGHT,
  )

  if (!image) {
    throw new Error(`Failed to resolve image for ID "${imageId}".`)
  }

  logger.debug('Preparing request data.')
  const formData = new FormData()
  formData.append('images', image.image.toBlob())

  logger.debug('Executing PlantNet request.')
  return await request(formData)
}

async function request(formData: FormData) {
  try {
    return client.postForm<any, AxiosResponse<PlantNetResponse>>(
      '/v2/identify/all',
      formData,
      {
        params: {
          'api-key': config.plantNetApiKey,
          'include-related-images': true,
          'no-reject': true,
          'nb-results': 10,
          type: 'kt',
          detailed: true,
        },
      },
    )
  } catch (error) {
    logError(error)
    // TODO: store and communicate error states
  }
}

export type PlantNetRateLimit = {
  resetInSeconds: number
  remainingRequests: number
}

export function parseRateLimitHeader(
  headers: AxiosResponseHeaders,
): PlantNetRateLimit | undefined {
  const parts = headers['ratelimit'].split('')
  if (parts.length < 3) return

  const remainingRequests = parseInt(parts[1].split('=')[1], 10)
  const resetInSeconds = parseInt(parts[2].split('=')[1], 10)

  return { resetInSeconds, remainingRequests }
}
