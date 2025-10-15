import { type AxiosError } from "axios"
import logger from "../logger.ts"

export function logError(error: unknown) {
  const axiosError = error as AxiosError

  if (axiosError.response) {
    const response = axiosError.response
    logger.error("PlantNet response was outside of 2xxx.")
    logger.error("Response status:", {
      status: response.status,
      statusText: response.statusText,
    })
    logger.error("Response headers:", { headers: response.headers })
    logger.error("Response data:", { data: response.data })
  } else if (axiosError.request) {
    logger.error("PlantNet did not return a response.")
    logger.error("Request:", { request: axiosError.request })
  } else {
    logger.error("Failed to setup PlantNet request", {
      error: axiosError.message,
    })
  }
}
