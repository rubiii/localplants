import Button from "@/components/Button"
import DismissKeyboard from "@/components/DismissKeyboard"
import AddPrimaryImageField from "@/components/PlantForm/AddPrimaryImageField"
import EmoteField from "@/components/PlantForm/EmoteField"
import NameField from "@/components/PlantForm/NameField"
import NoteField from "@/components/PlantForm/NoteField"
import { PlantFormValues } from "@/components/PlantForm/types"
import useNavigation from "@/hooks/useNavigation"
import randomPlantName from "@/lib/randomPlantName"
import {
  Plant,
  PlantCollection,
  PlantImage,
  type PlantImageType,
} from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useCoState } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { SafeAreaView, View } from "react-native"
import { Asset } from "react-native-image-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add a plant",
  headerLargeTitle: true,
}

export default function AddPlant() {
  const [plantImage, setPlantImage] = useState<PlantImageType>()
  const { navigation, route } = useNavigation<"AddPlant">()

  const collectionId = route.params.collectionId
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { plants: true },
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, errors },
  } = useForm<PlantFormValues>({
    defaultValues: {
      name: randomPlantName(),
    },
  })

  const generatePlantName = () => {
    const currentName = getValues().name
    let newName = randomPlantName()

    const maxTries = 5
    let tries = 0
    while (currentName === newName && tries <= maxTries) {
      newName = randomPlantName()
      tries += 1
    }

    setValue("name", newName)
  }

  const createPlantImage = async (asset: Asset) => {
    if (!collection) return

    const imageOwner = Group.create()
    // imageOwner.addMember(collection.$jazz.owner)

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
    // plantImageOwner.addMember(collection.$jazz.owner)
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
    if (!isValid || !collection || !plantImage?.image) return

    const plantOwner = Group.create()
    plantOwner.addMember(collection.$jazz.owner)

    plantImage.$jazz.owner.addMember(plantOwner)
    plantImage.image.$jazz.owner.addMember(plantOwner)

    const plant = Plant.create(
      {
        name: data.name,
        primaryImage: plantImage,
        // TODO: does the list needs it's own explicit owner?
        images: [plantImage],
      },
      plantOwner,
    )

    plantImage.$jazz.set("emote", data.emote)
    plantImage.$jazz.set("note", data.note)
    collection.plants.$jazz.unshift(plant)

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
            <NameField
              control={control}
              errors={errors}
              generatePlantName={generatePlantName}
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
