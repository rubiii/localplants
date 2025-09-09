import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount } from "jazz-tools/expo"
import { Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Remove plant",
}

export default function RemovePlantScreen() {
  const { navigation, route } = useNavigation<"RemovePlant">()
  const { plantId, collectionId } = route.params

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: { plants: { $each: true } } } } },
  })

  const deletePlant = () => {
    if (!me) return

    const collection = me.root.collections.find(
      (c) => c.$jazz.id === collectionId,
    )
    if (!collection) return

    collection.plants.$jazz.remove((p) => p.$jazz.id === plantId)
    navigation.popToTop()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
        <Pressable
          onPress={deletePlant}
          className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-lg bg-[--error]"
        >
          <Icon.MaterialCommunity
            name="delete-outline"
            className="text-[--background]"
            size={24}
          />
          <Text className="text-xl text-[--background]">Remove this plant</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
