import Button from "@/components/Button"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { newRandomPlantName } from "@/lib/randomPlantName"
import { Plant, PlantCollection } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform, Pressable, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit Plant",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"EditPlant">()
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

export default function EditPlantScreen() {
  const { navigation, route } = useNavigation<"EditPlant">()
  const { plantId, plantName, collectionId } = route.params

  const [name, setName] = useState(plantName)
  const [note, setNote] = useState("")

  const plant = useCoState(Plant, plantId)
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { plants: { $each: true } },
  })

  const deletePlant = () => {
    if (!plant || !collection) return

    collection.plants.$jazz.remove((p) => p.$jazz.id === plant.$jazz.id)
    navigation.popToTop()
  }

  useEffect(() => {
    const valid = !!name

    const updatePlant = () => {
      if (!plant || !valid) return

      plant.$jazz.set("name", name)
      navigation.goBack()
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? updatePlant : undefined} />
      ),
    })
  }, [navigation, plant, name])

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <View className="flex-1">
        <TextField
          placeholder="What’s their name?"
          value={name}
          setValue={(value) => setName(value || "")}
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

        <TextField
          value={note}
          setValue={(value) => setNote(value || "")}
          placeholder="Add a note if you like …"
          multiline={true}
          numberOfLines={5}
        />
      </View>

      <Button onPress={deletePlant} title="Delete plant" />
    </ScrollableScreenContainer>
  )
}
