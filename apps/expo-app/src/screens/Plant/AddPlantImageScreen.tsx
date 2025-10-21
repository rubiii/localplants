import EmoteSelect from "@/components/EmoteSelect"
import HeaderTextButton from "@/components/HeaderTextButton"
import PlantImageSelect from "@/components/PlantImageSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import { TextField } from "@/components/base"
import useNavigation from "@/hooks/useNavigation"
import { createPlantImage } from "@localplants/jazz"
import {
  Plant,
  type PlantImageType
} from "@localplants/jazz/schema"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { type Asset } from "react-native-image-picker"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add Photo",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"AddPlantImage">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

function HeaderRight({ onSave }: { onSave?: (() => void) | undefined }) {
  return (
    <HeaderTextButton
      text="Save"
      variant="primary"
      onPress={onSave}
      disabled={!onSave}
    />
  )
}

export default function AddPlantImageScreen() {
  const [plantImage, setPlantImage] = useState<PlantImageType>()
  const [emote, setEmote] = useState<string>()
  const [note, setNote] = useState<string>()
  const valid = !!plantImage

  const { navigation, route } = useNavigation<"AddPlantImage">()
  const { plantId } = route.params

  const plant = useCoState(Plant, plantId, { resolve: { images: true } })

  const createPlantImageFromAsset = async (asset: Asset) => {
    if (!asset.uri) return

    const newPlantImage = await createPlantImage({
      uri: asset.uri,
      timestamp: asset.timestamp,
    })

    setPlantImage(newPlantImage)
  }

  const save = () => {
    if (!plant || !valid) return

    plantImage.$jazz.set("emote", emote)
    plantImage.$jazz.set("note", note)
    plant.images.$jazz.unshift(plantImage)
    plant.$jazz.set("primaryImage", plantImage)

    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? save : undefined} />
      ),
    })
  })

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <PlantImageSelect
        plantImage={plantImage}
        createPlantImage={createPlantImageFromAsset}
      />

      <EmoteSelect value={emote} setValue={setEmote} />

      <TextField
        placeholder="Add a note if you like …"
        multiline={true}
        numberOfLines={5}
        value={note}
        setValue={setNote}
      />
    </ScrollableScreenContainer>
  )
}
