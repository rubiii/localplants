import HeaderContextMenu from "@/components/HeaderContextMenu"
import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import { Plant, type PlantImageType } from "@/schema"
import { type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect, useRef, useState } from "react"
import { FlatList, Pressable, Text, View } from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "Plant">
}): NativeStackNavigationOptions => ({
  title: route.params.title,
  headerBackButtonDisplayMode: "minimal",
  headerRight: () => <HeaderRight />,
})

function HeaderRight() {
  const { navigation, route } = useNavigation<"Plant">()
  const { plantId, collectionId, readOnly } = route.params

  if (readOnly) return

  return (
    <HeaderView>
      <HeaderIconButton
        icon="camera"
        community={true}
        onPress={() => navigation.navigate("AddPlantImage", { plantId })}
      />

      <HeaderContextMenu
        icon="dots-horizontal"
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate("SharePlant", { plantId })
          } else if (index === 1) {
            navigation.navigate("RemovePlant", { plantId, collectionId })
          }
        }}
        actions={[
          { title: "Share plant", systemIcon: "square.and.arrow.up" },
          {
            title: "Delete plant",
            systemIcon: "trash",
            destructive: true,
          },
        ]}
      />
    </HeaderView>
  )
}

export default function PlantScreeen() {
  const { route } = useNavigation<"Plant">()
  const { plantId } = route.params

  const [fullscreenPlantImage, setFullscreenPlantImage] =
    useState<PlantImageType>()

  const { navigation } = useNavigation()
  const listRef = useRef<FlatList>(null)

  const plant = useCoState(Plant, plantId, {
    resolve: {
      primaryImage: { image: true },
      images: { $each: { image: true } },
    },
  })

  // TODO: do we need this effect?
  useEffect(() => {
    if (!plant) return

    // update screen title when plant name changes
    navigation.setOptions({ title: plant.name })

    // scroll list to top when an image was added
    // TODO: change to scrollToIndex when images get sorted by date
    listRef.current?.scrollToOffset({ offset: 0 })
  }, [plant, navigation])

  return (
    <ScrollableScreenContainer>
      <View className="flex-1 -mt-[580]">
        <View className="w-[30] h-[600] border-r border-[--border]"></View>

        {(plant?.images || []).map((plantImage) => (
          <PlantImageView
            key={plantImage.$jazz.id.toString()}
            plantImage={plantImage}
          />
        ))}

        <View className="w-[30] h-full border-r border-[--border]"></View>
      </View>
    </ScrollableScreenContainer>
  )
}

function PlantImageView({ plantImage }: { plantImage: PlantImageType }) {
  const plantImageId = plantImage.$jazz.id
  const { navigation } = useNavigation()

  const createdAt = new Date(plantImage.createdAt)
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
      <View className="items-center w-[24] min-w-[24] ml-5 mr-6">
        {plantImage.emote ? (
          <>
            <View className="h-[10] w-px border-r border-[--border]" />
            <Icon.MaterialCommunity
              name={`emoticon-${plantImage.emote}-outline` as any}
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

      <View className="flex-1 py-4 pr-6">
        <Text className="mb-3 text-sm text-[--secondaryText]">
          {weekday}, {day}. {month} {year}{" "}
          <Text className="text-[--mutedText]">({time})</Text>
        </Text>

        {plantImage?.image ? (
          <Pressable
            onPress={() =>
              navigation.navigate("PlantImageModal", { plantImageId })
            }
          >
            <Image
              imageId={plantImage.image.$jazz.id}
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

        {plantImage.note?.length ? (
          <Text className="text-lg mt-2 mb-2 text-[--secondaryText]">
            {plantImage.note}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
