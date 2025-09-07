import Button from "@/components/Button"
import Icon from "@/components/Icon"
import useDeviceSettings from "@/hooks/useDeviceSettings"
import useNavigation from "@/hooks/useNavigation"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCallback, useEffect, useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from "react-native-permissions"
import { ResultMap } from "react-native-permissions/dist/typescript/results"
import { SafeAreaView } from "react-native-safe-area-context"

type PermissionResult = ResultMap[keyof ResultMap]

export const routeOptions: NativeStackNavigationOptions = {
  title: "Welcome",
  headerLargeTitle: true,
}

export default function WelcomeScreen() {
  const { navigation } = useNavigation()
  const settings = useDeviceSettings()

  const [cameraPermission, setCameraPermission] = useState<PermissionResult>()
  const [libraryPermission, setLibraryPermission] = useState<PermissionResult>()

  const permissionsGranted =
    cameraPermission === "granted" ||
    cameraPermission === "limited" ||
    libraryPermission === "granted" ||
    libraryPermission === "limited"

  const finishWelcome = async () => {
    await settings.setValue("skip-welcome")
    navigation.replace("Plants")
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 pt-4 pb-12 px-5">
        <View className="flex-1">
          <Text className="text-[--foregroundSecondary]">
            The following permissions are needed
            {"\n"}
            for different features of the app.
          </Text>

          <View style={{ flex: 1, marginTop: 60, gap: 36 }}>
            <CameraPermissions
              status={cameraPermission}
              setStatus={setCameraPermission}
            />
            <LibraryPermissions
              status={libraryPermission}
              setStatus={setLibraryPermission}
            />
          </View>
        </View>

        <Button
          title="Continue"
          size="large"
          onPress={finishWelcome}
          disabled={!permissionsGranted}
        />
      </View>
    </SafeAreaView>
  )
}

function CameraPermissions({
  status,
  setStatus,
}: {
  status?: PermissionResult
  setStatus: any
}) {
  const iosPermission = PERMISSIONS.IOS.CAMERA
  const androidPermission = PERMISSIONS.ANDROID.CAMERA
  const permission = Platform.OS === "ios" ? iosPermission : androidPermission

  const setAndLogStatus = useCallback(
    (status: PermissionResult) => {
      setStatus(status)
      console.debug("Library permission status", status)
    },
    [setStatus],
  )

  const configure = () => {
    switch (status) {
      case "denied":
        // permission has not been requested or is denied but requestable
        console.debug("Requesting camera permissions")
        request(permission).then(setAndLogStatus)
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

  useEffect(() => {
    check(permission).then(setAndLogStatus)
  }, [permission, setAndLogStatus])

  return (
    <SafeAreaView className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-end">
          <View className="flex-row flex-grow items-baseline">
            <Icon.Feather
              name="camera"
              className="text-[--foreground]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--foreground]">Camera</Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--foregroundSecondary]">
          Access front and back camera
          {"\n"}
          for taking photos of your plants.
        </Text>
      </View>
    </SafeAreaView>
  )
}

function LibraryPermissions({
  status,
  setStatus,
}: {
  status?: PermissionResult
  setStatus: any
}) {
  const iosPermission = PERMISSIONS.IOS.PHOTO_LIBRARY
  const androidPermission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
  const permission = Platform.OS === "ios" ? iosPermission : androidPermission

  const setAndLogStatus = useCallback(
    (status: PermissionResult) => {
      setStatus(status)
      console.debug("Library permission status", status)
    },
    [setStatus],
  )

  const configure = () => {
    switch (status) {
      case "denied":
        // permission has not been requested or is denied but requestable
        console.debug("Requesting camera permissions")
        request(permission).then(setAndLogStatus)
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

  useEffect(() => {
    check(permission).then(setAndLogStatus)
  }, [permission, setAndLogStatus])

  return (
    <View className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-end">
          <View className="flex-row flex-grow items-baseline">
            <Icon.Feather
              name="image"
              className="text-[--foreground]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--foreground]">
              Photo library
            </Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--foregroundSecondary]">
          Access your photo library to select
          {"\n"}
          existing photos of your plants.
        </Text>
      </View>
    </View>
  )
}

const ConfigureButton = ({
  configure,
  status,
}: {
  configure: any
  status?: PermissionResult
}) => {
  if (status === "denied" || status === "blocked") {
    return (
      <Pressable
        onPress={configure}
        className="rounded-2xl py-1 px-2.5 bg-[--primary]"
      >
        <Text className="text-[--primaryForeground]">Configure</Text>
      </Pressable>
    )
  }

  const icon = status === "unavailable" ? "error-outline" : "check-circle"

  let className
  if (status === "unavailable") {
    className = "text-[--error]"
  } else if (status === "granted") {
    className = "text-[--success]"
  } else if (status === "limited") {
    className = "text-[--warning]"
  }

  return (
    <Pressable onPress={configure}>
      <Icon.Feather name={icon as any} className={className} size={26} />
    </Pressable>
  )
}
