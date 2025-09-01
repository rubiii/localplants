import Button from "@/components/Button"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation from "@/hooks/useNavigation"
import { Plant, type PlantImageType } from "@/schema"
import {
  useRoute,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect, useRef } from "react"
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

function HeaderRight({ plantId }: { plantId: string }) {
  const { navigate } = useNavigation()

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable
        className="group p-2"
        onPress={() => navigate("EditPlant", { plantId })}
      >
        <Icon.MaterialCommunity
          name="circle-edit-outline"
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>

      <Pressable
        className="group p-2 -mr-2"
        onPress={() => navigate("RemovePlant", { plantId })}
      >
        <Icon.MaterialCommunity
          name="delete-circle-outline"
          className="text-[--foreground] group-active:text-[--error]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}

export default function PlantDetails() {
  const route = useRoute()
  const plantId = (route.params as any).plantId

  const navigation = useNavigation()
  const listRef = useRef<FlatList>(null)

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

  useEffect(() => {
    if (!plant) return

    // update screen title when plant name changes
    navigation.setOptions({ title: plant.name })

    // scroll list to top when an image was added
    listRef.current?.scrollToOffset({ offset: 0 })
  }, [plant, navigation])

  return (
    <SafeAreaView className="flex-1 flex-col bg-[--background]">
      {plant ? (
        <>
          <View className="flex-row items-start">
            <View className="flex items-center w-[26] min-w-[26] ml-5 mr-6">
              <View className="h-[16] w-px border-r border-[--border]" />

              <Icon.Material
                name="add-a-photo"
                className="text-[--primary]"
                size={24}
              />

              <View className="w-px min-h-[42] border-r border-[--border]" />
            </View>

            <View className="pt-4 pb-3">
              <Button
                title="Add a photo"
                size="small"
                onPress={() =>
                  navigation.navigate("AddPlantImage", { plantId })
                }
              />
            </View>
          </View>

          <FlatList
            ref={listRef}
            data={plant.images}
            renderItem={({ item }) =>
              item ? <Row plantId={plant.$jazz.id} image={item} /> : null
            }
            keyExtractor={(image) =>
              image ? image.$jazz.id.toString() : "none"
            }
          />
        </>
      ) : null}
    </SafeAreaView>
  )
}

const Row = ({
  plantId,
  image,
}: {
  plantId: string
  image: PlantImageType
}) => {
  const { navigate } = useNavigation()

  const createdAt = new Date(image.createdAt)
  const weekday = createdAt.toLocaleString(undefined, { weekday: "long" })
  const day = createdAt.toLocaleString(undefined, { day: "2-digit" })
  const month = createdAt.toLocaleString(undefined, { month: "long" })
  const year = createdAt.toLocaleString(undefined, { year: "numeric" })
  const time = createdAt.toLocaleString(undefined, {
    timeStyle: "short",
    hour12: true,
  })

  return (
    <View className="flex-row items-start">
      <View className="flex items-center w-[26] min-w-[26] ml-5 mr-6">
        {image.emote ? (
          <>
            <View className="h-[10] w-px border-r border-[--border]" />
            <Icon.MaterialCommunity
              name={`emoticon-${image.emote}-outline` as any}
              className="text-[--primary]"
              size={24}
            />
          </>
        ) : (
          <>
            <View className="h-[16] w-px border-r border-[--border]" />
            <View className="w-3 h-3 rounded-full bg-[--primary]" />
          </>
        )}

        <View className="w-px flex-1 min-h-[42] border-r border-[--border]" />
      </View>

      <View className="flex-1 py-4 pr-4">
        <Text className="mb-3 text-sm text-[--foregroundSecondary]">
          {weekday}, {day}. {month} {year}{" "}
          <Text className="text-[--foregroundMuted]">({time})</Text>
        </Text>

        {image?.thumbnail ? (
          // TODO: Zoomable doesn't work. do we still need this?
          // <Zoomable>
          <Pressable
            onPress={() =>
              navigate("EditPlantImage", {
                plantId,
                plantImageId: image.$jazz.id,
              })
            }
          >
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
          </Pressable>
        ) : null}

        {image.note?.length ? (
          <Text className="text-lg mt-2 mb-6 text-[--foregroundSecondary]">
            {image.note}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
