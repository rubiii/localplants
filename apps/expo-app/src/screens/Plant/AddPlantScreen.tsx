import { Icon, TextField } from "@/components/base"
import EmoteSelect from "@/components/EmoteSelect"
import HeaderTextButton from "@/components/HeaderTextButton"
import HemisphereSelect from "@/components/HemisphereSelect"
import PlantImageSelect from "@/components/PlantImageSelect"
import PlantSizeSelect from "@/components/PlantSizeSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { createPlantImage } from "@localplants/jazz"
import {
  Plant,
  PlantCollection,
  PlantIdentity,
  PlantImages,
  type PlantImageType
} from "@localplants/jazz/schema"
import { randomPlantName } from "@localplants/utils"
import { type Hemisphere, type PlantSize } from "@localplants/utils/watering"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform, Pressable } from "react-native"
import { type Asset } from "react-native-image-picker"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add Plant",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"AddPlant">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

function HeaderRight({ onSave }: { onSave?: () => void }) {
  return (
    <HeaderTextButton
      text="Save"
      variant="primary"
      onPress={onSave}
      disabled={!onSave}
    />
  )
}

export default function AddPlantScreen() {
  const [plantImage, setPlantImage] = useState<PlantImageType>()
  const [name, setName] = useState<string | undefined>(randomPlantName())
  const [hemisphere, setHemisphere] = useState<Hemisphere | undefined>()
  const [size, setSize] = useState<PlantSize>("md")
  const [emote, setEmote] = useState<string>()
  const [note, setNote] = useState<string>()
  const valid = !!(plantImage && name && size)

  const { navigation, route } = useNavigation<"AddPlant">()
  const { collectionId } = route.params

  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { plants: true },
  })

  const createPlantImageFromAsset = async (asset: Asset) => {
    if (!collection || !asset.uri) return

    const newPlantImage = await createPlantImage({
      uri: asset.uri,
      timestamp: asset.timestamp,
    })

    setPlantImage(newPlantImage)
  }

  const createPlant = () => {
    if (!collection || !plantImage?.image) return

    const plantOwner = Group.create()

    // Allow members of collection to access all plants
    plantOwner.addMember(collection.$jazz.owner)

    const plantImages = PlantImages.create([plantImage], Group.create())
    const identity = PlantIdentity.create({ state: "none" }, Group.create())

    // Add plant owner to subvalues
    plantImage.$jazz.owner.addMember(plantOwner)
    plantImage.image.$jazz.owner.addMember(plantOwner)
    plantImages.$jazz.owner.addMember(plantOwner)
    identity.$jazz.owner.addMember(plantOwner)

    const plant = Plant.create(
      {
        name: name as string,
        hemisphere: hemisphere,
        size: size,
        primaryImage: plantImage,
        images: plantImages,
        identity: identity,
      },
      plantOwner
    )

    plant.$jazz.set("size", size)
    plant.$jazz.set("hemisphere", hemisphere)
    plantImage.$jazz.set("emote", emote)
    plantImage.$jazz.set("note", note)
    collection.plants.$jazz.unshift(plant)

    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? createPlant : undefined} />
      ),
    })
  })

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <PlantImageSelect
        plantImage={plantImage}
        createPlantImage={createPlantImageFromAsset}
      />

      <TextField
        placeholder="What’s their name?"
        value={name}
        setValue={setName}
        maxLength={50}
        icon={
          <Pressable
            onPress={() => setName(randomPlantName(name))}
            className="group items-center justify-center"
          >
            <Icon
              name="auto-awesome"
              size={19}
              color="secondary"
              activeColor="primary"
            />
          </Pressable>
        }
      />

      <PlantSizeSelect value={size} setValue={setSize} />
      <HemisphereSelect
        autoValue={collection?.hemisphere}
        value={hemisphere}
        setValue={setHemisphere}
      />
      <EmoteSelect value={emote} setValue={setEmote} />

      <TextField
        value={note}
        setValue={setNote}
        placeholder="Add a note if you like …"
        multiline={true}
        numberOfLines={5}
      />
    </ScrollableScreenContainer>
  )
}
