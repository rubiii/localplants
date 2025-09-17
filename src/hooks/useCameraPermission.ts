import { useEffect, useState } from "react"
import { Platform } from "react-native"
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from "react-native-permissions"
import { ResultMap } from "react-native-permissions/dist/typescript/results"

type PermissionResult = ResultMap[keyof ResultMap]

const PERMISSION =
  Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA

export default function useCameraPermission() {
  const [status, setStatus] = useState<PermissionResult>()
  const missing = status !== "granted" && status !== "limited"

  useEffect(() => {
    check(PERMISSION).then(setStatus)
  }, [setStatus])

  const configure = () => {
    switch (status) {
      case "denied":
        // permission has not been requested or is denied but requestable
        console.debug("Requesting camera permissions")
        request(PERMISSION).then(setStatus)
        break

      case "blocked": // permission is denied and not requestable
      case "granted": // permission already granted
      case "limited": // permission granted with limitations
        console.debug("Opening application settings")
        openSettings("application").catch(() =>
          console.error("Failed to open application settings"),
        )
        break

      case "unavailable": // feature unavailable on this device or in this context
      default:
        break
    }
  }

  return {
    status,
    configure,
    missing,
  }
}
