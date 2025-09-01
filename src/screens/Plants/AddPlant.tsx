import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import useNavigation from "@/hooks/useNavigation"
import randomName from "@/lib/randomName"
import { MyAppAccount, Plant, PlantImage, type PlantType } from "@/schema"
import { Group } from "jazz-tools"
import { useAccount } from "jazz-tools/expo"
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

export default function AddPlant() {
  const [plant, setPlant] = useState<PlantType>()
  const [uploading, setUploading] = useState(false)
  const { goBack } = useNavigation()
  const { me } = useAccount(MyAppAccount, {
    resolve: {
      root: {
        plants: true,
      },
    },
  })

  const createPlant = async (asset: Asset) => {
    if (!me || !asset.uri) {
      console.debug("[createPlant] does not (yet?) have me or asset.uri")
      return
    }

    console.debug("[createPlant] creating image")
    const image = await createImage(asset.uri, {
      owner: Group.create(),
      progressive: true,
      placeholder: "blur",
      maxSize: 2400,
    })
    console.debug("[createPlant] created image")

    console.debug("[createPlant] creating thumbnail")
    const thumbnail = await createImage(asset.uri, {
      owner: Group.create(),
      progressive: true,
      placeholder: "blur",
      maxSize: 1200,
    })
    console.debug("[createPlant] created thumbnail")

    console.debug("[createPlant] creating plantImage")
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
    console.debug("[createPlant] created plantImage")

    console.debug("[createPlant] creating plant")
    const plant = Plant.create(
      {
        name: randomName(),
        primaryImage: plantImage,
        images: [plantImage],
      },
      { owner: Group.create() },
    )
    console.debug("[createPlant] created plant")
    me.root.plants.$jazz.push(plant)

    setPlant(plant)
  }

  const { takePhoto } = useCamera()
  const addPhotoViaCamera = async () => {
    const asset = await takePhoto()
    if (!asset) return

    setUploading(true)
    await createPlant(asset)
    goBack()
  }

  const { pickPhoto } = useGallery()
  const addPhotoFromGallery = async () => {
    const asset = await pickPhoto()
    if (!asset) return

    setUploading(true)
    await createPlant(asset)
    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--bg-page]">
      <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
        {!plant && !uploading ? (
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
