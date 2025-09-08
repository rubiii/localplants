import DismissKeyboard from "@/components/DismissKeyboard"
import EmoteSelect from "@/components/EmoteSelect"
import HeaderTextButton from "@/components/HeaderTextButton"
import PlantImageSelect from "@/components/PlantImageSelect"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { Plant, PlantImage, type PlantImageType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useCoState } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useState } from "react"
import { Platform, SafeAreaView, View } from "react-native"
import { Asset } from "react-native-image-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add photo",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

function HeaderRight({ onSave }: { onSave?: () => void }) {
  return <HeaderTextButton text="Save" onPress={onSave} disabled={!onSave} />
}

export default function AddPlantImageScreen() {
  const [plantImage, setPlantImage] = useState<PlantImageType>()
  const [emote, setEmote] = useState<string>()
  const [note, setNote] = useState<string>()
  const valid = !!plantImage

  const { navigation, route } = useNavigation<"AddPlantImage">()
  const { plantId } = route.params

  const plant = useCoState(Plant, plantId, { resolve: { images: true } })

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
  }

  const savePlantImage = () => {
    if (!plant || !valid) return

    plantImage.$jazz.set("emote", emote)
    plantImage.$jazz.set("note", note)
    plant.images.$jazz.unshift(plantImage)
    plant.$jazz.set("primaryImage", plantImage)

    navigation.goBack()
  }

  setTimeout(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? savePlantImage : undefined} />
      ),
    })
  }, 1)

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <KeyboardAwareScrollView bottomOffset={62} className="px-4 py-6">
        <DismissKeyboard>
          <View className="gap-8">
            <PlantImageSelect
              plantImage={plantImage}
              createPlantImage={createPlantImage}
            />

            <EmoteSelect value={emote} setValue={setEmote} />

            <TextField
              placeholder="Add a note if you like …"
              multiline={true}
              numberOfLines={5}
              value={note}
              setValue={setNote}
            />
          </View>
        </DismissKeyboard>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
