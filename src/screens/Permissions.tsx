import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import theme from "@/theme"
import { clsx } from "clsx"
import { useColorScheme } from "nativewind"
import { useCallback, useEffect, useState } from "react"
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native"
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
} from "react-native-permissions"
import { ResultMap } from "react-native-permissions/dist/typescript/results"

type PermissionResult = ResultMap[keyof ResultMap]

export default function Permissions() {
  const { navigate } = useNavigation()
  const { colorScheme } = useColorScheme()
  const [cameraPermission, setCameraPermission] = useState<PermissionResult>()
  const [libraryPermission, setLibraryPermission] = useState<PermissionResult>()

  const permissionsGranted =
    cameraPermission === "granted" ||
    cameraPermission === "limited" ||
    libraryPermission === "granted" ||
    libraryPermission === "limited"

  return (
    <SafeAreaView
      style={theme[colorScheme || "light"]}
      className="flex-1 bg-[--bg-page]"
    >
      <View className="flex-1 pt-12 pb-12 px-8">
        <View className="flex-1">
          <Text className="text-5xl text-[--text-headline]">Permissions</Text>

          <Text className="mt-2 text-[--text-copy]">
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

        <ContinueButton
          onPress={() => navigate("Plants")}
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
        request(iosPermission).then(setAndLogStatus)
        break

      case "blocked":
        // permission is denied and not requestable
        console.debug("Opening application settings")
        openSettings("application").catch(() =>
          console.error("Failed to open application settings"),
        )
        break

      case "granted": // permission already granted
      case "limited": // permission granted with limitations
      case "unavailable": // feature unavailable on this device or in this context
      default:
        break
    }
  }

  useEffect(() => {
    if (Platform.OS === "ios") {
      check(iosPermission).then(setAndLogStatus)
    }
  }, [iosPermission, setAndLogStatus])

  return (
    <View className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-baseline">
          <View className="flex-row flex-grow items-baseline">
            <Icon.Feather
              name="camera"
              className="text-[--text-copy]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--text-copy]">Camera</Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--text-copy]">
          Access front and back camera
          {"\n"}
          for taking photos of your plants.
        </Text>
      </View>
    </View>
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
        console.debug("Requesting library permissions")
        request(iosPermission).then(setAndLogStatus)
        break

      case "blocked":
        // permission is denied and not requestable
        console.debug("Opening application settings")
        openSettings("application").catch(() =>
          console.error("Failed to open application settings"),
        )
        break

      case "granted": // permission already granted
      case "limited": // permission granted with limitations
      case "unavailable": // feature unavailable on this device or in this context
      default:
        break
    }
  }

  useEffect(() => {
    if (Platform.OS === "ios") {
      check(iosPermission).then(setAndLogStatus)
    }
  }, [iosPermission, setAndLogStatus])

  return (
    <View className="flex-row">
      <View className="flex-1">
        <View className="flex-row items-baseline">
          <View className="flex-row flex-grow items-baseline">
            <Icon.Feather
              name="image"
              className="text-[--text-copy]"
              size={24}
            />
            <Text className="ml-3 text-2xl text-[--text-copy]">
              Photo library
            </Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text className="mt-2 text-[--text-copy]">
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
  if (status === "granted" || status === "limited") {
    return (
      <Icon.Feather
        name="check-circle"
        className="text-[--text-success]"
        size={20}
      />
    )
  }

  if (status === "unavailable") {
    return (
      <Icon.Feather
        name="x-circle"
        className="text-[--text-failure]"
        size={20}
      />
    )
  }

  // status === "denied" || status === "blocked"
  return (
    <View>
      <Pressable
        onPress={configure}
        className="rounded-2xl py-1 px-2.5 bg-[--bg-btn-default]"
      >
        <Text className="text-[--text-btn-default]">Configure</Text>
      </Pressable>
    </View>
  )
}

const ContinueButton = ({
  onPress,
  disabled = false,
}: {
  onPress: any
  disabled?: boolean
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx("rounded-2xl py-6 px-8", {
        "bg-[--bg-btn-default]": !disabled,
        "bg-[--bg-btn-disabled]": disabled,
      })}
    >
      <Text
        className={clsx("text-xl", {
          "text-[--text-btn-default]": !disabled,
          "text-[--text-btn-disabled]": disabled,
        })}
      >
        Continue
      </Text>
    </Pressable>
  )
}
