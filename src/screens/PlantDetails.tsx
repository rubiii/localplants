import Button from "@/components/Button"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import { Plant, type PlantImageType } from "@/schema"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { useHeaderHeight } from "@react-navigation/elements"
import { type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect, useRef, useState } from "react"
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "PlantDetails">
}): NativeStackNavigationOptions => ({
  title: route.params.title,
  headerLargeTitle: true,
  headerRight: () => {
    const plantId = route.params.plantId
    const collectionId = route.params.collectionId
    const readOnly = route.params.readOnly
    return (
      <HeaderRight
        plantId={plantId}
        collectionId={collectionId}
        readOnly={readOnly}
      />
    )
  },
})

function HeaderRight({
  plantId,
  collectionId,
  readOnly,
}: {
  plantId: string
  collectionId: string
  readOnly: boolean
}) {
  const { navigation } = useNavigation()

  const gotoSharePlant = () => navigation.navigate("SharePlant", { plantId })
  const gotoRemovePlant = () =>
    navigation.navigate("RemovePlant", { plantId, collectionId })

  if (readOnly) return

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable className="group p-2" onPress={gotoSharePlant}>
        <Icon.Material
          name="share"
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>

      <Pressable className="group p-2 -mr-2" onPress={gotoRemovePlant}>
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
  const { route } = useNavigation<"PlantDetails">()
  const plantId = route.params.plantId
  const readOnly = route.params.readOnly

  const [activePlantImage, setActivePlantImage] = useState<PlantImageType>()

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
    <SafeAreaView className="flex-1 flex-col bg-[--background]">
      {plant ? (
        <>
          {!readOnly ? (
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
          ) : (
            <View className="flex-row items-start">
              <View className="flex items-center w-[26] min-w-[26] ml-5 mr-6">
                <View className="h-[32] w-px border-r border-[--border]"></View>
              </View>
            </View>
          )}

          <FlatList
            ref={listRef}
            data={plant.images}
            renderItem={({ item }) =>
              item ? (
                <Row
                  plantImage={item}
                  setActivePlantImage={setActivePlantImage}
                />
              ) : null
            }
            keyExtractor={(image) =>
              image ? image.$jazz.id.toString() : "none"
            }
          />
        </>
      ) : null}

      {activePlantImage?.image ? (
        <FullSizePlantImage
          activePlantImage={activePlantImage}
          setActivePlantImage={setActivePlantImage}
        />
      ) : null}
    </SafeAreaView>
  )
}

function FullSizePlantImage({
  activePlantImage,
  setActivePlantImage,
}: {
  activePlantImage: PlantImageType
  setActivePlantImage: (plantImage?: PlantImageType) => void
}) {
  const headerHeight = useHeaderHeight()
  const windowHeight = Dimensions.get("window").height

  if (!activePlantImage?.image) return

  return (
    <>
      <Pressable
        className="group absolute z-[99] top-4 right-4"
        style={{ marginTop: headerHeight }}
        onPress={() => setActivePlantImage(undefined)}
      >
        <Icon.MaterialCommunity
          name="close-circle-outline"
          size={42}
          className="text-[--foreground] group-active:text-[--primary]"
        />
      </Pressable>

      <View className="absolute z-[98] h-screen w-screen min-h-full bg-[--background]">
        <Zoomable minScale={0.5} isDoubleTapEnabled={true} maxPanPointers={1}>
          <Image
            imageId={activePlantImage.image.$jazz.id}
            resizeMode="cover"
            style={{
              width: "100%",
              height: windowHeight - headerHeight,
              marginTop: headerHeight,
            }}
            height={2400}
            width={2400}
          />
        </Zoomable>
      </View>
    </>
  )
}

function Row({
  plantImage,
  setActivePlantImage,
}: {
  plantImage: PlantImageType
  setActivePlantImage: (plantImage: PlantImageType) => void
}) {
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
      <View className="flex items-center w-[26] min-w-[26] ml-5 mr-6">
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

      <View className="flex-1 py-4 pr-4">
        <Text className="mb-3 text-sm text-[--foregroundSecondary]">
          {weekday}, {day}. {month} {year}{" "}
          <Text className="text-[--foregroundMuted]">({time})</Text>
        </Text>

        {plantImage?.image ? (
          <Pressable onPress={() => setActivePlantImage(plantImage)}>
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
          <Text className="text-lg mt-2 mb-6 text-[--foregroundSecondary]">
            {plantImage.note}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
