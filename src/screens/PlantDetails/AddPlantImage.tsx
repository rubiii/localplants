import Button from "@/components/Button"
import DismissKeyboard from "@/components/DismissKeyboard"
import AddPrimaryImageField from "@/components/PlantForm/AddPrimaryImageField"
import EmoteField from "@/components/PlantForm/EmoteField"
import NoteField from "@/components/PlantForm/NoteField"
import { PlantFormValues } from "@/components/PlantForm/types"
import useNavigation from "@/hooks/useNavigation"
import randomPlantName from "@/lib/randomPlantName"
import { Plant, PlantImage, type PlantImageType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useCoState } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { View } from "react-native"
import { Asset } from "react-native-image-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { SafeAreaView } from "react-native-safe-area-context"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add a photo",
  headerLargeTitle: true,
}

export default function AddPlantImage() {
  const [plantImage, setPlantImage] = useState<PlantImageType>()
  const { navigation, route } = useNavigation<"AddPlantImage">()

  const plantId = route.params.plantId
  const plant = useCoState(Plant, plantId, { resolve: { images: true } })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<PlantFormValues>({
    defaultValues: {
      name: randomPlantName(),
    },
  })

  const createPlantImage = async (asset: Asset) => {
    if (!plant) return

    const imageOwner = Group.create()
    imageOwner.addMember(plant.$jazz.owner)

    console.debug("[createPlantImage] creating image")
    const image = await createImage(asset.uri as string, {
      owner: imageOwner,
      progressive: true,
      placeholder: "blur",
      maxSize: 2400,
    })
    console.debug("[createPlantImage] created image")

    const addedAt = new Date().toISOString()
    const createdAt = asset.timestamp
      ? new Date(asset.timestamp).toISOString()
      : addedAt

    const plantImageOwner = Group.create()
    plantImageOwner.addMember(plant.$jazz.owner)
    const newPlantImage = PlantImage.create(
      {
        image,
        assetUri: asset.uri,
        createdAt,
        addedAt,
      },
      plantImageOwner,
    )

    setPlantImage(newPlantImage)
    setValue("primaryImageId", newPlantImage.$jazz.id)
  }

  const onSubmit = (data: PlantFormValues) => {
    if (!isValid || !plant || !plantImage) return

    plantImage.$jazz.set("emote", data.emote)
    plantImage.$jazz.set("note", data.note)
    plant.images.$jazz.unshift(plantImage)
    plant.$jazz.set("primaryImage", plantImage)

    navigation.goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <KeyboardAwareScrollView bottomOffset={62} className="py-8 px-5">
        <DismissKeyboard>
          <View className="mb-12 gap-8">
            <AddPrimaryImageField
              plantImage={plantImage}
              createPlantImage={createPlantImage}
            />
            <EmoteField control={control} errors={errors} />
            <NoteField control={control} errors={errors} />
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            title="Save"
            size="large"
            disabled={!plantImage || !isValid}
          />
        </DismissKeyboard>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
