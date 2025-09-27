import { AxiosError } from 'axios'
import logger from '../logger.js'

export function logError(error: unknown) {
  const axiosError = error as AxiosError

  if (axiosError.response) {
    logger.error('PlantNet response was outside of 2xxx.')
    logger.debug('Response status:', axiosError.response.status)
    logger.debug('Response headers:', axiosError.response.headers)
    logger.debug('Response data:`, axiosError.response.data')
  } else if (axiosError.request) {
    logger.error('PlantNet did not return a response.')
    logger.debug('Request:`, axiosError.request')
  } else {
    logger.error('Failed to setup PlantNet request', axiosError.message)
  }
}
