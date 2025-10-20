const config = {
  jazzSyncServer: fetchEnv<"wss://${string}">(
    "EXPO_PUBLIC_JAZZ_SYNC_SERVER",
    process.env["EXPO_PUBLIC_JAZZ_SYNC_SERVER"],
  ),
  plantIdWorkerAccount: fetchEnv<string>(
    "EXPO_PUBLIC_PLANTID_WORKER_ACCOUNT",
    process.env["EXPO_PUBLIC_PLANTID_WORKER_ACCOUNT"],
  ),
  plantNetApiCoValue: fetchEnv<string>(
    "EXPO_PUBLIC_PLANT_NET_API_CO_VALUE",
    process.env["EXPO_PUBLIC_PLANT_NET_API_CO_VALUE"],
  ),
}

function fetchEnv<T>(key: string, value?: string) {
  if (!value)
    throw new Error(
      `Missing env value for ${key}.\nEnv: ${JSON.stringify(process.env)}`,
    )
  return value as T
}

export default config
