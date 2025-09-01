import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant, PlantImage } from "@/schema"
import { useRoute } from "@react-navigation/native"
import { Group } from "jazz-tools"
import { useAccount, useCoState } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native"
import type { Asset } from "react-native-image-picker"

export default function AddPlantImage() {
  const route = useRoute()
  const plantId = (route.params as any).plantId

  const [uploading, setUploading] = useState(false)

  const { goBack } = useNavigation()

  const { me } = useAccount(MyAppAccount, {
    resolve: {
      root: {
        plants: true,
      },
    },
  })

  const plant = useCoState(Plant, plantId, {
    resolve: {
      images: true,
    },
  })

  const addPlantImage = async (asset: Asset) => {
    if (!me || !plant || !asset.uri) {
      console.debug("[addPlantImage] does not (yet?) have me or asset.uri")
      return
    }

    console.debug("[addPlantImage] creating image")
    const image = await createImage(asset.uri, {
      owner: Group.create(),
      progressive: true,
      placeholder: "blur",
      maxSize: 2400,
    })
    console.debug("[addPlantImage] created image")

    console.debug("[addPlantImage] creating thumbnail")
    const thumbnail = await createImage(asset.uri, {
      owner: Group.create(),
      progressive: true,
      placeholder: "blur",
      maxSize: 1200,
    })
    console.debug("[addPlantImage] created thumbnail")

    console.debug("[addPlantImage] creating plantImage")
    const createdAt = asset.timestamp
      ? new Date(asset.timestamp).toISOString()
      : new Date().toISOString()
    const plantImage = PlantImage.create({
      image,
      thumbnail,
      note: "",
      moods: {
        happy: false,
        worried: false,
      },
      createdAt,
    })
    console.debug("[addPlantImage] created plantImage")

    plant.images.$jazz.unshift(plantImage)
    plant.$jazz.set("primaryImage", plantImage)
  }

  const { takePhoto } = useCamera()
  const addPhotoViaCamera = async () => {
    const asset = await takePhoto()
    if (!asset) return

    setUploading(true)
    await addPlantImage(asset)
    goBack()
  }

  const { pickPhoto } = useGallery()
  const addPhotoFromGallery = async () => {
    const asset = await pickPhoto()
    if (!asset) return

    setUploading(true)
    await addPlantImage(asset)
    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--bg-page]">
      <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
        {!uploading ? (
          <>
            <Pressable
              onPress={addPhotoViaCamera}
              className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-2xl bg-[--bg-btn-default]"
            >
              <Icon.Feather
                name="camera"
                className="text-[--text-btn-default]"
                size={24}
              />
              <Text className="text-xl text-[--text-btn-default] text-lg">
                Take a photo
              </Text>
            </Pressable>

            <Pressable
              onPress={addPhotoFromGallery}
              className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-2xl bg-[--bg-btn-default]"
            >
              <Icon.Feather
                name="image"
                className="text-[--text-btn-default]"
                size={24}
              />
              <Text className="text-xl text-[--text-btn-default] text-lg">
                Pick from gallery
              </Text>
            </Pressable>
          </>
        ) : null}

        {uploading ? <ActivityIndicator size="large" /> : null}
      </View>
    </SafeAreaView>
  )
}
