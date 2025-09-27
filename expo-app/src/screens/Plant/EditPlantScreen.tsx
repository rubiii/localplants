import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { newRandomPlantName } from "@/lib/randomPlantName"
import { Plant } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"

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
  const { plantId, plantName } = route.params

  const [name, setName] = useState(plantName)
  const [note, setNote] = useState("")

  const plant = useCoState(Plant, plantId, {
    resolve: { idRequests: { $each: { results: true } } },
  })

  const openIdentification = () =>
    navigation.navigate("PlantIdentification", { plantId, plantName })

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

      {plant && plant.idRequests.length > 0 ? (
        <View className="gap-2">
          <View className="group my-4 border-b border-[--border]">
            <View className="flex-row items-end">
              <Text className="px-6 text-lg text-[--text]">
                Plant identified!
              </Text>
            </View>

            <Pressable onPress={openIdentification} className="px-6">
              <Icon.Material name="edit" size={24} className="text-[--text]" />
            </Pressable>
          </View>
          <Text className="px-6 text-[--mutedText]">Plant identified as</Text>
        </View>
      ) : (
        <Pressable onPress={openIdentification} className="gap-2">
          <View className="group my-4 border-b border-[--border]">
            <Text className="px-6 text-lg text-[--text]">
              Click to identify plant
            </Text>
          </View>
          <Text className="px-6 text-[--mutedText]">Plant identified as</Text>
        </Pressable>
      )}

      <TextField
        value={note}
        setValue={(value) => setNote(value || "")}
        placeholder="Add a note if you like …"
        multiline={true}
        numberOfLines={5}
      />
    </ScrollableScreenContainer>
  )
}
