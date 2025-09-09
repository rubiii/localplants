import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount } from "jazz-tools/expo"
import { Platform, Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Remove Collection",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
}

function HeaderLeft() {
  const { navigation } = useNavigation<"EditCollection">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

export default function RemoveCollectionScreen() {
  const { navigation, route } = useNavigation<"RemoveCollection">()
  const { collectionId } = route.params

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  const removeCollection = () => {
    if (!me) return

    me.root.collections.$jazz.remove((c) => c.$jazz.id === collectionId)
    navigation.popToTop()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
        <Pressable
          onPress={removeCollection}
          className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-lg bg-[--error]"
        >
          <Icon.MaterialCommunity
            name="delete-outline"
            className="text-[--background]"
            size={24}
          />
          <Text className="text-xl text-[--background]">Remove collection</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
