import DismissKeyboard from "@/components/DismissKeyboard"
import HeaderTextButton from "@/components/HeaderTextButton"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { PlantCollection } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, SafeAreaView, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit collection",
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

export default function EditCollectionScreen() {
  const { navigation, route } = useNavigation<"EditCollection">()
  const { collectionId, collectionName } = route.params

  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { sharedBy: true },
  })

  const [name, setName] = useState<string | undefined>(
    collection?.name || collectionName,
  )
  const valid = !!name

  const updateCollection = () => {
    if (!collection || !valid) return

    collection.$jazz.set("name", name)
    navigation.goBack()
  }

  setTimeout(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? updateCollection : undefined} />
      ),
    })
  }, 1)

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <KeyboardAwareScrollView bottomOffset={62} className="px-4 py-6">
        <DismissKeyboard>
          <View className="gap-12">
            <TextField
              placeholder="Name of collection"
              autoFocus={true}
              value={name}
              setValue={setName}
            />

            {collection?.sharedBy ? (
              <View className="px-6">
                <Text className="text-[--muted-text]">
                  This collection was shared with you
                  {"\n"}
                  by {collection.sharedBy.name || collection.sharedBy.accountID}
                  {"\n"}
                  on{" "}
                  {new Date(collection.sharedBy.sharedAt).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
          </View>
        </DismissKeyboard>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
