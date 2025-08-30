import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { Plant, type PlantImage } from "@/schema"
import theme from "@/theme"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import {
  useRoute,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Image, useCoState } from "jazz-tools/expo"
import { useColorScheme } from "nativewind"
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<ParamListBase, "PlantDetails">
}): NativeStackNavigationOptions => ({
  title: (route.params as any).name,
  headerLargeTitle: true,
  headerRight: () => <HeaderRight plantId={(route.params as any).plantId} />,
})

export function HeaderRight({ plantId }: { plantId: string }) {
  const { colorScheme } = useColorScheme()
  const { navigate } = useNavigation()

  return (
    <View style={theme[colorScheme || "light"]} className="flex-row">
      <Pressable
        className="group p-2"
        onPress={() => navigate("AddPlantImage", { plantId })}
      >
        <Icon.Material
          name="add-a-photo"
          className="text-[--text-headline] group-active:text-[--text-copy]"
          size={24}
        />
      </Pressable>

      <Pressable
        className="group p-2 -mr-2"
        onPress={() => navigate("RemovePlant", { plantId })}
      >
        <Icon.MaterialCommunity
          name="trash-can-outline"
          className="text-[--text-headline] group-active:text-[--text-copy]"
          size={24}
        />
      </Pressable>
    </View>
  )
}

export default function PlantDetails() {
  const route = useRoute()
  const plantId = (route.params as any).plantId

  const { colorScheme } = useColorScheme()

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

  return (
    <SafeAreaView
      style={theme[colorScheme || "light"]}
      className="flex-1 flex-col bg-[--bg-page]"
    >
      {plant ? (
        <FlatList
          data={plant.images}
          renderItem={({ item }) => (item ? <Row image={item} /> : null)}
          keyExtractor={(image) => (image ? image.$jazz.id.toString() : "none")}
          className="pt-6"
        />
      ) : null}
    </SafeAreaView>
  )
}

const Row = ({ image }: { image: PlantImage }) => {
  const weekday = new Date(image.createdAt).toLocaleString(undefined, {
    weekday: "long",
  })
  const day = new Date(image.createdAt).toLocaleString(undefined, {
    day: "2-digit",
  })
  const month = new Date(image.createdAt).toLocaleString(undefined, {
    month: "long",
  })
  const year = new Date(image.createdAt).toLocaleString(undefined, {
    year: "numeric",
  })
  const time = new Date(image.createdAt).toLocaleString(undefined, {
    timeStyle: "short",
    hour12: true,
  })

  return (
    <View className="flex-row items-start">
      <View className="basis-[25%] pl-2">
        <Text className="text-sm text-right text-[--text-copy]">
          {weekday}
          {"\n"}
          {day}. {month}
          {"\n"}
          {year}
          {"\n"}
          {time}
        </Text>
      </View>

      <View className="basis-[1px] ml-2 mr-6 border-r border-[--bg-border]">
        <View className="flex-1 w-px" />
      </View>

      <View className="basis-[63%] pb-8">
        {image?.thumbnail ? (
          <Zoomable>
            <Image
              imageId={image.thumbnail.$jazz.id}
              resizeMode="cover"
              style={{
                width: "100%",
                height: 180,
                borderRadius: 6,
              }}
              height={180}
              width={400}
            />
          </Zoomable>
        ) : null}

        {image.note ? (
          <Text className="text-[--text-copy]">{image.note}</Text>
        ) : null}
      </View>
    </View>
  )
}
