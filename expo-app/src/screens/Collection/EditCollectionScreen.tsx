import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { PlantCollection } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Edit Collection",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"EditCollection">()
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? updateCollection : undefined} />
      ),
    })
  })

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-12">
      <TextField
        placeholder="Name of collection"
        size="large"
        autoFocus={true}
        value={name}
        setValue={setName}
      />

      {collection?.sharedBy ? (
        <View className="px-6">
          <Text className="text-[--mutedText]">
            This collection was shared with you
            {"\n"}
            by {collection.sharedBy.name || collection.sharedBy.accountID}
            {"\n"}
            on {new Date(collection.sharedBy.sharedAt).toLocaleDateString()}
          </Text>
        </View>
      ) : null}
    </ScrollableScreenContainer>
  )
}
