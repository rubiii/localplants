import HeaderTextButton from "@/components/HeaderTextButton"
import HemisphereSelect from "@/components/HemisphereSelect"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import { Hemisphere } from "@/lib/watering/types"
import { MyAppAccount, PlantCollection } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { Platform } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Add Collection",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
}

function HeaderLeft() {
  const { navigation } = useNavigation<"AddCollection">()
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

export default function AddCollectionScreen() {
  const { navigation } = useNavigation<"AddCollection">()

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: true } },
  })

  const [name, setName] = useState<string | undefined>()
  const [hemisphere, setHemisphere] = useState<Hemisphere | undefined>()
  const valid = !!(name && hemisphere)

  const createCollection = () => {
    if (!valid || !me) return

    const collection = PlantCollection.create({
      name: name.trim(),
      hemisphere,
      plants: [],
    })
    me.root.collections.$jazz.unshift(collection)

    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight onSave={valid ? createCollection : undefined} />
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

      <HemisphereSelect value={hemisphere} setValue={setHemisphere} />
    </ScrollableScreenContainer>
  )
}
