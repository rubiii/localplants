import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import { PlantImageType } from "@/schema"
import { Image } from "jazz-tools/expo"
import { useState } from "react"
import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { Asset } from "react-native-image-picker"

type Steps = "initial" | "choose-upload" | "upload" | "image"

export default function AddPrimaryImageField({
  plantImage,
  createPlantImage,
}: {
  plantImage?: PlantImageType
  createPlantImage: (asset: Asset) => Promise<void>
}) {
  const [step, setStep] = useState<Steps>("initial")

  const { takePhoto } = useCamera()
  const addPhotoViaCamera = async () => {
    const asset = await takePhoto()
    if (!asset?.uri) return

    setStep("upload")
    await createPlantImage(asset)
    setStep("image")
  }

  const { pickPhoto } = useGallery()
  const addPhotoFromLibrary = async () => {
    const asset = await pickPhoto()
    if (!asset?.uri) return

    setStep("upload")
    await createPlantImage(asset)
    setStep("image")
  }

  if (step === "initial") {
    return <InitialState nextStep={() => setStep("choose-upload")} />
  }

  if (step === "choose-upload") {
    return (
      <ChooseUploadState
        viaCamera={addPhotoViaCamera}
        viaLibrary={addPhotoFromLibrary}
      />
    )
  }

  if (step === "upload") {
    return <UploadState />
  }

  return <ImageState plantImage={plantImage} />
}

function InitialState({ nextStep }: { nextStep: () => void }) {
  return (
    <View className="h-[180] items-center justify-center bg-[--input] rounded-xl">
      <Pressable
        onPress={nextStep}
        className="group flex-row w-full gap-1 py-6 items-center justify-center"
      >
        <Icon.MaterialCommunity
          name="image-search"
          size={60}
          className="text-[--foreground] group-active:text-[--primary]"
        />
      </Pressable>
    </View>
  )
}

function ChooseUploadState({
  viaCamera,
  viaLibrary,
}: {
  viaCamera: () => void
  viaLibrary: () => void
}) {
  return (
    <View className="h-[180] items-center justify-center bg-[--input] rounded-xl">
      <View className="flex-row">
        <Pressable
          onPress={viaCamera}
          className="group w-1/2 gap-1 py-6 items-center justify-center"
        >
          <Icon.MaterialCommunity
            name="camera-outline"
            size={42}
            className="text-[--foreground] group-active:text-[--primary]"
          />
          <Text className="text-[--foreground] group-active:text-[--primary]">
            Take a photo
          </Text>
        </Pressable>

        <View className="my-4 border-r-hairline border-[--border]"></View>

        <Pressable
          onPress={viaLibrary}
          className="group w-1/2 gap-1 py-6 items-center justify-center"
        >
          <Icon.MaterialCommunity
            name="image-outline"
            size={42}
            className="text-[--foreground] group-active:text-[--primary]"
          />
          <Text className="text-[--foreground] group-active:text-[--primary]">
            Select a photo
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

function UploadState() {
  return (
    <View className="h-[180] items-center justify-center bg-[--input] rounded-xl">
      <ActivityIndicator size="large" className="text-[--foreground]" />
    </View>
  )
}

function ImageState({ plantImage }: { plantImage?: PlantImageType }) {
  if (!plantImage?.image) return

  return (
    <View className="h-[180] max-h-[180]">
      <Image
        imageId={plantImage.image.$jazz.id}
        resizeMode="cover"
        style={{
          width: "100%",
          height: 180,
          borderRadius: 12,
        }}
        height={180}
        width={400}
      />
    </View>
  )
}
