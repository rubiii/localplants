import { ConfirmButton, Text, TextField } from "@/components/base"
import HeaderTextButton from "@/components/HeaderTextButton"
import HemisphereSelect from "@/components/HemisphereSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, PlantCollection } from "@localplants/jazz/schema"
import { type Hemisphere } from "@localplants/utils/watering"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount, useCoState } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform, View } from "react-native"

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

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  const collection = useCoState(PlantCollection, collectionId, {
    resolve: { sharedBy: true, plants: true },
  })

  const [hemisphere, setHemisphere] = useState<Hemisphere | undefined>(
    collection?.hemisphere
  )
  const [name, setName] = useState<string | undefined>(
    collection?.name || collectionName
  )
  const valid = !!(name && hemisphere)

  const updateCollection = () => {
    if (!collection || !valid) return

    collection.$jazz.set("name", name.trim())
    collection.$jazz.set("hemisphere", hemisphere)
    navigation.goBack()
  }

  const deleteCollection = () => {
    if (!me) return

    me.root.collections.$jazz.remove((c) => c.$jazz.id === collectionId)
    navigation.popToTop()
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
        value={name}
        setValue={setName}
      />

      <HemisphereSelect value={hemisphere} setValue={setHemisphere} />

      {collection?.sharedBy ? (
        <View className="px-6">
          <Text color="muted">
            This collection was shared with you
            {"\n"}
            by {collection.sharedBy.name || collection.sharedBy.accountID}
            {"\n"}
            on {new Date(collection.sharedBy.sharedAt).toLocaleDateString()}
          </Text>
        </View>
      ) : null}

      <View className="gap-1">
        <Text size="sm" className="ml-3">
          Danger zone
        </Text>

        <View className="px-3 py-3 gap-3 rounded-lg bg-[--card]">
          {collection?.plants.length ? (
            <Text>
              Deleting this collection while also delete all{" "}
              {collection?.plants.length} plants.
            </Text>
          ) : (
            <Text>
              This collection contains no plants and can be deleted without
              losing any precious data.
            </Text>
          )}

          <View className="items-start">
            <ConfirmButton
              title="Delete collection"
              confirm="Really delete collection?"
              variant="dangerous"
              onPress={deleteCollection}
            />
          </View>
        </View>
      </View>
    </ScrollableScreenContainer>
  )
}
