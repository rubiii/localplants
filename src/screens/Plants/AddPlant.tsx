import Button from "@/components/Button"
import DismissKeyboard from "@/components/DismissKeyboard"
import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import useNavigation from "@/hooks/useNavigation"
import randomPlantName from "@/lib/randomPlantName"
import {
  MyAppAccount,
  Plant,
  PlantImage,
  type PlantImageType,
  type PlantType,
} from "@/schema"
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

type FormData = {
  name: string
  note: string
  emote: string
}

export default function AddPlant() {
  const randomName = randomPlantName()

  const [plant, setPlant] = useState<PlantType>()
  const [plantImage, setPlantImage] = useState<PlantImageType>()
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

  const uploadStarted = () => {
    setUploading(true)
    setShowForm(true)
  }

  const uploadFinished = ({
    plant,
    plantImage,
  }: {
    plant: PlantType
    plantImage: PlantImageType
  }) => {
    if (!me) return

    me.root.plants.$jazz.unshift(plant)

    setPlant(plant)
    setPlantImage(plantImage)
    setUploading(false)
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
    if (!plant || !plantImage || !isValid) return

    plant.$jazz.set("name", data.name)
    plantImage.$jazz.set("emote", data.emote)
    plantImage.$jazz.set("note", data.note)

    goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      {!showForm ? (
        <PlantImageUpload
          randomName={randomName}
          uploadStarted={uploadStarted}
          uploadFinished={uploadFinished}
        />
      ) : (
        <DismissKeyboard>
          <View className="flex-1 pt-6 pb-12 px-5">
            <View className="flex-1">
              <PlantForm control={control} errors={errors} />
            </View>

            <Button
              title="Add plant"
              size="large"
              busy={uploading}
              onPress={handleSubmit(onSubmit)}
              disabled={uploading || !isValid}
            />
          </View>
        </DismissKeyboard>
      )}
    </SafeAreaView>
  )
}

function PlantImageUpload({
  randomName,
  uploadStarted,
  uploadFinished,
}: {
  randomName: string
  uploadStarted: () => void
  uploadFinished: ({
    plant,
    plantImage,
  }: {
    plant: PlantType
    plantImage: PlantImageType
  }) => void
}) {
  const createPlant = async (asset: Asset) => {
    if (!asset.uri) {
      console.debug("[createPlant] does not (yet?) have me or asset.uri")
      return
    }

    uploadStarted()

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

      // TODO: remove
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

    uploadFinished({ plant, plantImage })
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

  return (
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
  )
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
      <View>
        <Text className="pb-2 text-lg text-[--foregroundSecondary]">
          What’s her name?
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
        {errors.name && (
          <Text className="pt-2 text-[--error]">Please enter a name</Text>
        )}
      </View>

      <View className="pt-10">
        <Text className="pb-2 text-lg text-[--foregroundSecondary]">
          How does she feel?
        </Text>

        <Controller
          name="emote"
          control={control}
          render={({ field: { onChange, value } }) => {
            const toggleChange = (name: string) =>
              onChange(name === value ? undefined : name)

            return (
              <View className="flex-row gap-3">
                <Emote name="excited" onPress={toggleChange} active={value} />
                <Emote name="neutral" onPress={toggleChange} active={value} />
                <Emote name="frown" onPress={toggleChange} active={value} />
                <Emote name="cry" onPress={toggleChange} active={value} />
                <Emote name="lol" onPress={toggleChange} active={value} />
              </View>
            )
          }}
        />
      </View>

      <View className="pt-10">
        <Text className="pb-2 text-lg text-[--foregroundSecondary]">
          Something else?
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Add a note if you like …"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={6}
              className="text-xl text-[--foreground] bg-[--input] px-6 pt-4 pb-6 rounded-xl"
            />
          )}
          name="note"
        />
      </View>
    </>
  )
}

function Emote({
  name,
  onPress,
  active,
}: {
  name: string
  onPress: (name: string) => void
  active?: string
}) {
  return (
    <Pressable onPress={() => onPress(name)}>
      <Icon.MaterialCommunity
        name={`emoticon-${name}-outline` as any}
        className={active === name ? "text-[--primary]" : "text-[--foreground]"}
        size={36}
      />
    </Pressable>
  )
}
