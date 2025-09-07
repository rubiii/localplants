import Icon from "@/components/Icon"
import useCamera from "@/hooks/useCamera"
import useGallery from "@/hooks/useGallery"
import { PlantImageType } from "@/schema"
import { Image } from "jazz-tools/expo"
import { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import ContextMenu from "react-native-context-menu-view"
import { Asset } from "react-native-image-picker"

type Steps = "initial" | "upload" | "image"

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
    return (
      <InitialState
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

function InitialState({
  viaCamera,
  viaLibrary,
}: {
  viaCamera: () => void
  viaLibrary: () => void
}) {
  return (
    <ContextMenu
      onPress={({ nativeEvent: { index } }) => {
        if (index === 0) {
          viaCamera()
        } else if (index === 1) {
          viaLibrary()
        }
      }}
      onPreviewPress={undefined}
      dropdownMenuMode={true}
      actions={[
        { title: "Take Photo", systemIcon: "camera" },
        {
          title: "Choose Photo",
          systemIcon: "photo.on.rectangle",
        },
      ]}
    >
      <View className="h-[180] items-center justify-center bg-[--input] rounded-lg">
        <View className="rounded-full p-6 bg-[--primary]">
          <Icon.MaterialCommunity
            name="image-search"
            size={32}
            className="text-[--background]"
          />
        </View>
      </View>
    </ContextMenu>
  )
}

function UploadState() {
  return (
    <View className="h-[180] items-center justify-center bg-[--input] rounded-lg">
      <View className="rounded-full p-6 bg-[--primary]">
        <ActivityIndicator size="small" className="text-[--background]" />
      </View>
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
