import Icon from "@/components/Icon"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import { PlantImage } from "@/schema"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { Image, useCoState } from "jazz-tools/expo"
import { Pressable, View } from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "PlantImageModal">
}): NativeStackNavigationOptions => ({
  headerShown: false,
  headerBlurEffect: "none",
  headerTransparent: true,
})

export default function PlantImageModal() {
  const { navigation, route } = useNavigation<"PlantImageModal">()
  const { plantImageId } = route.params

  const plantImage = useCoState(PlantImage, plantImageId, {
    resolve: { image: true },
  })

  const closeModal = () => navigation.goBack()

  return (
    <View className="flex-1 bg-[--background]">
      <Pressable
        className={clsx(
          "group absolute z-[10] top-10 right-4",
          "p-0.5 items-center justify-center aspect-square rounded-full",
          "bg-[--card] active:bg-[--primary]",
        )}
        onPress={closeModal}
      >
        <Icon
          community
          name="close-circle-outline"
          size={35}
          activeColor="background"
        />
      </Pressable>

      <Zoomable minScale={0.75} isDoubleTapEnabled={true}>
        {plantImage?.image ? (
          <Image
            imageId={plantImage.image.$jazz.id}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
            height="original"
            width="original"
          />
        ) : null}
      </Zoomable>
    </View>
  )
}
