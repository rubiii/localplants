import { Icon } from "@/components/base"
import useCamera from "@/hooks/useCamera"
import useCameraPermission from "@/hooks/useCameraPermission"
import useGallery from "@/hooks/useGallery"
import useGalleryPermission from "@/hooks/useGalleryPermission"
import { type PlantImageType } from "@localplants/jazz/schema"
import { Image } from "jazz-tools/expo"
import { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import ContextMenu from "react-native-context-menu-view"
import { type Asset } from "react-native-image-picker"

type Steps = "initial" | "upload" | "image"

export default function PlantImageSelect({
  plantImage,
  createPlantImage,
}: {
  plantImage?: PlantImageType
  createPlantImage: (asset: Asset) => Promise<void>
}) {
  const [step, setStep] = useState<Steps>("initial")

  const cameraPermission = useCameraPermission()
  const galleryPermission = useGalleryPermission()

  const { takePhoto } = useCamera()
  const addPhotoViaCamera = async () => {
    // check camera permission
    if (cameraPermission.missing) {
      cameraPermission.configure()
      return
    }

    // camera needs gallery permission as well
    if (galleryPermission.missing) {
      galleryPermission.configure()
      return
    }

    const asset = await takePhoto()
    if (!asset?.uri) return

    setStep("upload")
    await createPlantImage(asset)
    setStep("image")
  }

  const { pickPhoto } = useGallery()
  const addPhotoFromGallery = async () => {
    // check gallery permission
    if (galleryPermission.missing) {
      galleryPermission.configure()
      return
    }

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
        viaGallery={addPhotoFromGallery}
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
  viaGallery,
}: {
  viaCamera: () => void
  viaGallery: () => void
}) {
  return (
    <ContextMenu
      onPress={({ nativeEvent: { index } }) => {
        if (index === 0) {
          viaCamera()
        } else if (index === 1) {
          viaGallery()
        }
      }}
      dropdownMenuMode={true}
      actions={[
        { title: "Take Photo", systemIcon: "camera" },
        {
          title: "Choose Photo",
          systemIcon: "photo.on.rectangle",
        },
      ]}
    >
      <View className="h-[180] items-center justify-center bg-[--card] rounded-lg">
        <View className="rounded-full p-6 bg-[--primary]">
          <Icon name="image-search" size={32} color="background" />
        </View>
      </View>
    </ContextMenu>
  )
}

function UploadState() {
  return (
    <View className="h-[180] items-center justify-center bg-[--card] rounded-lg">
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
          borderRadius: 8,
        }}
        height={180}
        width={400}
      />
    </View>
  )
}
