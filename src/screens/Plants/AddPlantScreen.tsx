import DismissKeyboard from "@/components/DismissKeyboard"
import EmoteSelect from "@/components/EmoteSelect"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import PlantImageSelect from "@/components/PlantImageSelect"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { newRandomPlantName, randomPlantName } from "@/lib/randomPlantName"
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
import { Platform, Pressable, SafeAreaView, View } from "react-native"
import { Asset } from "react-native-image-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add plant",
  headerTransparent: false,
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

    const addedAt = new Date().toISOString()
    const createdAt = asset.timestamp
      ? new Date(asset.timestamp).toISOString()
      : addedAt

    const newPlantImage = PlantImage.create(
      {
        image,
        assetUri: asset.uri,
        createdAt,
        addedAt,
      },
      Group.create(),
    )

    setPlantImage(newPlantImage)
  }

  const createPlant = () => {
    if (!collection || !plantImage?.image) return

    const plantOwner = Group.create()
    plantOwner.addMember(collection.$jazz.owner)

    plantImage.$jazz.owner.addMember(plantOwner)
    plantImage.image.$jazz.owner.addMember(plantOwner)

    const plant = Plant.create(
      {
        name: name as string,
        primaryImage: plantImage,
        // TODO: does the list needs it's own explicit owner?
        images: [plantImage],
      },
      plantOwner,
    )

    plantImage.$jazz.set("emote", emote)
    plantImage.$jazz.set("note", note)
    collection.plants.$jazz.unshift(plant)

    navigation.goBack()
  }

  setTimeout(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? createPlant : undefined} />
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
                    className="text-[--secondary-text] group-active:text-[--primary]"
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
          </View>
        </DismissKeyboard>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
