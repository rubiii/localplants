import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant } from "@/schema"
import { useRoute } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount, useCoState } from "jazz-tools/expo"
import { Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Remove plant",
}

export default function RemovePlant() {
  const route = useRoute()
  const plantId = (route.params as any).plantId

  const { navigate } = useNavigation()

  const { me } = useAccount(MyAppAccount, {
    resolve: {
      root: {
        plants: {
          $each: true,
        },
      },
    },
  })

  const plant = useCoState(Plant, plantId, {
    resolve: {
      primaryImage: {
        thumbnail: true,
      },
      images: {
        $each: {
          thumbnail: true,
        },
      },
    },
  })

  const deletePlant = () => {
    if (!me || !plant) return

    me.root.plants.$jazz.remove((p) => p.$jazz.id === plant.$jazz.id)
    navigate("Plants")
  }

  return (
    <SafeAreaView className="flex-1 bg-[--bg-page]">
      <View className="flex-1 w-full pt-12 px-8 pb-24 gap-6 justify-center items-center">
        <Pressable
          onPress={deletePlant}
          className="flex-row gap-2 py-6 px-8 w-3/4 justify-center items-center rounded-2xl bg-[--bg-btn-default]"
        >
          <Icon.Feather
            name="camera"
            className="text-[--text-btn-default]"
            size={24}
          />
          <Text className="text-xl text-[--text-btn-default] text-lg">
            Remove this plant
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
