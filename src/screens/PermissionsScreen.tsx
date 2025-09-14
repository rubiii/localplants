import Button from "@/components/Button"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useCameraPermission from "@/hooks/useCameraPermission"
import useGalleryPermission from "@/hooks/useGalleryPermission"
import useNavigation from "@/hooks/useNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Pressable, Text, View } from "react-native"
import { ResultMap } from "react-native-permissions/dist/typescript/results"
import { SafeAreaView } from "react-native-safe-area-context"

type PermissionResult = ResultMap[keyof ResultMap]

export const routeOptions: NativeStackNavigationOptions = {
  title: "Permissions",
  headerBackTitle: "Welcome",
}

export default function PermissionsScreen() {
  const { navigation } = useNavigation<"Permissions">()

  const cameraPermission = useCameraPermission()
  const galleryPermission = useGalleryPermission()
  const permissionsGranted =
    !cameraPermission.missing && !galleryPermission.missing

  const finishWelcome = async () => {
    await AsyncStorage.setItem("skip-welcome", "true")
    navigation.replace("Plants")
  }

  return (
    <ScrollableScreenContainer className="px-4 landscape:pl-20 pt-24 landscape:pt-8 pb-8">
      <Text className="text-6xl font-bold text-[--primary]">Permissions</Text>

      <View className="gap-4 mb-12">
        <CameraPermissions
          status={cameraPermission.status}
          configure={cameraPermission.configure}
        />
        <GalleryPermissions
          status={galleryPermission.status}
          configure={galleryPermission.configure}
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
  configure,
}: {
  status?: PermissionResult
  configure: () => void
}) {
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

function GalleryPermissions({
  status,
  configure,
}: {
  status?: PermissionResult
  configure: () => void
}) {
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
  configure: () => void
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
