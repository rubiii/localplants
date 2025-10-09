import Button from "@/components/Button"
import Icon, { MaterialCommunityIcon } from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import useCameraPermission from "@/hooks/useCameraPermission"
import useGalleryPermission from "@/hooks/useGalleryPermission"
import useNavigation from "@/hooks/useNavigation"
import { ThemeColor } from "@/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Pressable, View } from "react-native"
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
      <Text color="primary" weight={700} size="6xl">
        Permissions
      </Text>

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
        size="lg"
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
            <Icon community name="camera-outline" size={24} />
            <Text size="2xl" className="ml-3">
              Camera
            </Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text color="secondary" className="mt-2">
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
            <Icon community name="image-multiple-outline" size={24} />
            <Text size="2xl" className="ml-3">
              Photo library
            </Text>
          </View>

          <ConfigureButton configure={configure} status={status} />
        </View>

        <Text color="secondary" className="mt-2">
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
        <Text color="background" activeColor="primary">
          Configure
        </Text>
      </Pressable>
    )
  }

  let color: ThemeColor | undefined
  let icon: MaterialCommunityIcon = "circle-outline"
  if (status === "unavailable") {
    icon = "alert-circle-outline"
    color = "error"
  } else if (status === "granted" || status === "limited") {
    icon = "check-circle-outline"
    color = "success"
  }

  return (
    <Pressable onPress={configure}>
      <Icon community name={icon} color={color} size={26} />
    </Pressable>
  )
}
