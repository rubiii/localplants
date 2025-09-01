import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, type PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Image, useAccount } from "jazz-tools/expo"

import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native"

const PLANT_ITEM_HEIGHT = 200

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your plants",
  headerLargeTitle: true,
  headerRight: () => <HeaderRight />,
}

export function HeaderRight() {
  const { navigate } = useNavigation()

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable className="group p-2" onPress={() => navigate("AddPlant")}>
        <Icon.Material
          name="add-circle-outline"
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>

      <Pressable
        className="group p-2 -mr-2"
        onPress={() => navigate("Account")}
      >
        <Icon.MaterialCommunity
          name="account-circle-outline"
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}

export default function Plants() {
  const { me } = useAccount(MyAppAccount, {
    resolve: {
      root: {
        plants: {
          $each: {
            primaryImage: {
              thumbnail: true,
            },
          },
        },
      },
    },
  })

  return (
    <SafeAreaView className="flex-1 flex-col bg-[--background]">
      <FlatList
        data={me?.root.plants || []}
        renderItem={({ item }) => <PlantItem plant={item} />}
        keyExtractor={(plant) => plant.$jazz.id.toString()}
        getItemLayout={(_data, index) => ({
          length: PLANT_ITEM_HEIGHT,
          offset: PLANT_ITEM_HEIGHT * index,
          index,
        })}
        numColumns={2}
        contentContainerStyle={{ gap: 36 }}
        columnWrapperStyle={{
          gap: 16,
          marginLeft: 16,
          marginRight: 16,
        }}
        className="pt-6"
      />
    </SafeAreaView>
  )
}

const PlantItem = ({ plant }: { plant: PlantType }) => {
  const { navigate } = useNavigation()

  return (
    <View style={{ height: PLANT_ITEM_HEIGHT, flex: 1, maxWidth: "100%" }}>
      <Pressable
        onPress={() =>
          navigate("PlantDetails", {
            plantId: plant.$jazz.id,
            name: plant.name,
          })
        }
      >
        <View
          className="rounded-lg bg-[--background-secondary]"
          style={{ height: 180, width: "100%" }}
        >
          {plant.primaryImage?.thumbnail && (
            <Image
              imageId={plant.primaryImage.thumbnail.$jazz.id}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 180,
                borderRadius: 6,
              }}
              height={180}
              width={400}
            />
          )}
        </View>

        <Text className="my-2 text-[--foregroundSecondary]">{plant.name}</Text>
      </Pressable>
    </View>
  )
}
