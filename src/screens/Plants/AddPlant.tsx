import Button from "@/components/Button"
import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import useNavigation from "@/hooks/useNavigation"
import randomPlantName from "@/lib/randomPlantName"
import { MyAppAccount, Plant, PlantImage, type PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useAccount } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useState } from "react"
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
} from "react-hook-form"
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import type { Asset } from "react-native-image-picker"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add plant",
}

export default function AddPlant() {
  const randomName = randomPlantName()

  const [plant, setPlant] = useState<PlantType>()
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

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

    setShowForm(true)
    setUploading(true)

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
        name: randomName,
        primaryImage: plantImage,
        images: [plantImage],
      },
      { owner: Group.create() },
    )
    console.debug("[createPlant] created plant")
    me.root.plants.$jazz.unshift(plant)

    setPlant(plant)
    setUploading(false)
  }

  const { takePhoto } = useCamera()
  const addPhotoViaCamera = async () => {
    const asset = await takePhoto()
    if (!asset) return

    createPlant(asset)
  }

  const { pickPhoto } = useGallery()
  const addPhotoFromGallery = async () => {
    const asset = await pickPhoto()
    if (!asset) return

    createPlant(asset)
  }

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormData>({
    defaultValues: {
      name: randomName,
    },
  })

  const onSubmit = (data: FormData) => {
    if (!plant || !isValid) return

    plant.$jazz.set("name", data.name)
    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      {!showForm ? (
        <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
          <Pressable
            onPress={addPhotoViaCamera}
            className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-2xl bg-[--primary]"
          >
            <Icon.Feather
              name="camera"
              className="text-[--primaryForeground]"
              size={24}
            />
            <Text className="text-xl text-[--primaryForeground] text-lg">
              Take a photo
            </Text>
          </Pressable>

          <Pressable
            onPress={addPhotoFromGallery}
            className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-2xl bg-[--primary]"
          >
            <Icon.Feather
              name="image"
              className="text-[--primaryForeground]"
              size={24}
            />
            <Text className="text-xl text-[--primaryForeground] text-lg">
              Pick from gallery
            </Text>
          </Pressable>
        </View>
      ) : null}

      {showForm ? (
        <View className="flex-1 pt-6 pb-12 px-5">
          <View className="flex-1">
            <PlantForm control={control} errors={errors} />
          </View>

          <Button
            title="Add plant"
            busy={uploading}
            onPress={handleSubmit(onSubmit)}
            disabled={uploading || !isValid}
          />
        </View>
      ) : null}
    </SafeAreaView>
  )
}

type FormData = {
  name: string
}

function PlantForm({
  control,
  errors,
}: {
  control: Control<FormData, any, FormData>
  errors: FieldErrors<FormData>
}) {
  return (
    <>
      <Text className="pb-2 text-lg text-[--foregroundSecondary]">
        Your plant’s name:
      </Text>

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="First name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoFocus
            className="text-xl text-[--foreground] bg-[--input] px-6 pt-4 pb-6 rounded-xl"
          />
        )}
        name="name"
      />
      {errors.name && <Text>This is required.</Text>}
    </>
  )
}
