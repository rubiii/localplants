import '@dotenvx/dotenvx/config'

const config = {
  jazzSyncServer: fetchEnv('JAZZ_SYNC_SERVER'),
  plantNetApi: fetchEnv('PLANTNET_API'),
  plantNetApiKey: fetchEnv('PLANTNET_API_KEY'),
  plantNetApiCoValue: fetchEnv('PLANTNET_API_CO_VALUE'),
  plantIdWorkerAccount: fetchEnv('PLANTID_WORKER_ACCOUNT'),
  plantIdWorkerSecret: fetchEnv('PLANTID_WORKER_SECRET'),
}

function fetchEnv(key: string) {
  const value = process.env[key]
  if (!value)
    throw new Error(
      `Missing env value for ${key}.\nEnv: ${JSON.stringify(process.env)}`,
    )
  return value
}

export default config
