import EmoteSelect from "@/components/EmoteSelect"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import PlantImageSelect from "@/components/PlantImageSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { newRandomPlantName, randomPlantName } from "@/lib/randomPlantName"
import {
  Plant,
  PlantCollection,
  PlantIdentity,
  PlantImage,
  PlantImages,
  type PlantImageType,
} from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useCoState } from "jazz-tools/expo"
import { createImage } from "jazz-tools/media"
import { useEffect, useState } from "react"
import { Platform, Pressable } from "react-native"
import { Asset } from "react-native-image-picker"

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
  const [emote, setEmote] = useState<string>()
  const [note, setNote] = useState<string>()
  const valid = !!(plantImage && name)

  const { navigation, route } = useNavigation<"AddPlant">()
  const { collectionId } = route.params

  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { plants: true },
  })

  const createPlantImage = async (asset: Asset) => {
    if (!collection) return

    console.debug("[createPlantImage] creating image")
    const image = await createImage(asset.uri as string, {
      owner: Group.create(),
      progressive: true,
      placeholder: "blur",
      maxSize: 2400,
    })
    console.debug("[createPlantImage] created image")

    const fileCreatedAt = asset.timestamp
      ? new Date(asset.timestamp).toISOString()
      : undefined

    const newPlantImage = PlantImage.create(
      {
        image,
        assetUri: asset.uri,
        fileCreatedAt,
      },
      Group.create(),
    )

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
        primaryImage: plantImage,
        images: plantImages,
        identity: identity,
      },
      plantOwner,
    )

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
        createPlantImage={createPlantImage}
      />

      <TextField
        placeholder="What’s their name?"
        value={name}
        setValue={setName}
        icon={
          <Pressable
            onPress={() => setName(newRandomPlantName(name))}
            className="group items-center justify-center"
          >
            <Icon.Material
              name="auto-awesome"
              size={19}
              className="text-[--secondaryText] group-active:text-[--primary]"
            />
          </Pressable>
        }
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
