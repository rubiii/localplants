import Button from "@/components/Button"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useDeviceSettings from "@/hooks/useDeviceSettings"
import useNavigation from "@/hooks/useNavigation"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import { openSettings, PERMISSIONS, request } from "react-native-permissions"
import { ResultMap } from "react-native-permissions/dist/typescript/results"
import { SafeAreaView } from "react-native-safe-area-context"

type PermissionResult = ResultMap[keyof ResultMap]

export const routeOptions: NativeStackNavigationOptions = {
  title: "Permissions",
  headerBackTitle: "Welcome",
}

export default function PermissionsScreen() {
  const { navigation } = useNavigation<"Permissions">()
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
    <ScrollableScreenContainer className="px-4 landscape:pl-20 pt-24 landscape:pt-8 pb-8">
      <Text className="text-6xl font-bold text-[--primary]">Permissions</Text>

      <View className="gap-4 mb-12">
        <CameraPermissions
          status={cameraPermission}
          setStatus={setCameraPermission}
        />
        <LibraryPermissions
          status={libraryPermission}
          setStatus={setLibraryPermission}
        />
      </View>

      <Button
        title="Continue"
        size="large"
        onPress={finishWelcome}
        disabled={!permissionsGranted}
      />
    </ScrollableScreenContainer>
  )
}

function CameraPermissions({
  status,
  setStatus,
}: {
  status?: PermissionResult
  setStatus: any
}) {
  const permission =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA

  const configure = () => {
    switch (status) {
      case "denied":
        // permission has not been requested or is denied but requestable
        console.debug("Requesting camera permissions")
        request(permission).then(setStatus)
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
    // check(permission).then(setStatus)
  }, [permission, setStatus])

  return (
    <SafeAreaView className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-end">
          <View className="flex-row flex-grow items-center">
            <Icon.MaterialCommunity
              name="camera-outline"
              className="text-[--text]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--text]">Camera</Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--secondaryText]">
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
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES

  const configure = () => {
    switch (status) {
      case "denied":
        // permission has not been requested or is denied but requestable
        console.debug("Requesting camera permissions")
        request(permission).then(setStatus)
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
    // check(permission).then(setStatus)
  }, [permission, setStatus])

  return (
    <View className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-end">
          <View className="flex-row flex-grow items-center">
            <Icon.MaterialCommunity
              name="image-multiple-outline"
              className="text-[--text]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--text]">Photo library</Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--secondaryText]">
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
        className="group rounded-full py-1 px-2.5 bg-[--primary] active:bg-[--card]"
      >
        <Text className="text-[--background] group-active:text-[--primary]">
          Configure
        </Text>
      </Pressable>
    )
  }

  let className = ""
  let icon = ""
  if (status === "unavailable") {
    icon = "error-outline"
    className = "text-[--error]"
  } else if (status === "granted" || status === "limited") {
    icon = "check-circle"
    className = "text-[--success]"
  }

  return (
    <Pressable onPress={configure}>
      <Icon.Material name={icon as any} className={className} size={26} />
    </Pressable>
  )
}
