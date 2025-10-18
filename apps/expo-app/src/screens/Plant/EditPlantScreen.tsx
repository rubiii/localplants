import { Button, Icon, TextField } from "@/components/base"
import HeaderTextButton from "@/components/HeaderTextButton"
import HemisphereSelect from "@/components/HemisphereSelect"
import PlantSizeSelect from "@/components/PlantSizeSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { Plant, PlantCollection } from "@localplants/jazz/schema"
import { randomPlantName } from "@localplants/utils"
import { type Hemisphere, type PlantSize } from "@localplants/utils/watering"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
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

  const plant = useCoState(Plant, plantId)
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { plants: { $each: true } },
  })

  const [name, setName] = useState(plantName)
  const [size, setSize] = useState<PlantSize | undefined>(plant?.size)
  const [hemisphere, setHemisphere] = useState<Hemisphere | undefined>(
    plant?.hemisphere
  )
  const [note, setNote] = useState("")

  const deletePlant = () => {
    if (!plant || !collection) return

    collection.plants.$jazz.remove((p) => p.$jazz.id === plant.$jazz.id)
    navigation.popToTop()
  }

  useEffect(() => {
    const valid = !!(name && size)

    const updatePlant = () => {
      if (!plant || !valid) return

      plant.$jazz.set("name", name)
      plant.$jazz.set("size", size)
      plant.$jazz.set("hemisphere", hemisphere)
      navigation.goBack()
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? updatePlant : undefined} />
      ),
    })
  }, [navigation, plant, name, size, hemisphere])

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <TextField
        placeholder="What’s their name?"
        value={name}
        setValue={(value) => setName(value || "")}
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

      <TextField
        value={note}
        setValue={(value) => setNote(value || "")}
        placeholder="Add a note if you like …"
        multiline={true}
        numberOfLines={5}
      />

      <View className="items-start">
        <Button onPress={deletePlant} title="Delete plant" />
      </View>
    </ScrollableScreenContainer>
  )
}
