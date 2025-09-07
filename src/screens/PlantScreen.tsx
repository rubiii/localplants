import Button from "@/components/Button"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import { Plant, type PlantImageType } from "@/schema"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { useHeaderHeight } from "@react-navigation/elements"
import { type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { ImageDefinition } from "jazz-tools"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Image as RNImage,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "Plant">
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

export default function PlantScreeen() {
  const { route } = useNavigation<"Plant">()
  const plantId = route.params.plantId
  const readOnly = route.params.readOnly

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
    <SafeAreaView className="flex-1 flex-col bg-[--background]">
      {plant ? (
        <View className="flex-1 z-[1] bg-[--background]">
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
                  fullscreenPlantImage={fullscreenPlantImage}
                  setFullscreenPlantImage={setFullscreenPlantImage}
                />
              ) : null
            }
            keyExtractor={(image) =>
              image ? image.$jazz.id.toString() : "none"
            }
          />
        </View>
      ) : null}

      {fullscreenPlantImage ? (
        <FullSizePlantImage
          plantImage={fullscreenPlantImage}
          closeView={() => {
            setFullscreenPlantImage(undefined)
          }}
        />
      ) : null}
    </SafeAreaView>
  )
}

function FullSizePlantImage({
  plantImage,
  closeView,
}: {
  plantImage: PlantImageType
  closeView: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const imageDefinition = useCoState(
    ImageDefinition,
    plantImage.image!.$jazz.id,
    { resolve: { original: true } },
  )
  const headerHeight = useHeaderHeight()
  const window = useWindowDimensions()

  const imageWidth = window.width
  const imageHeight = window.height
  const marginTop = Platform.OS === "ios" ? headerHeight / 2 : 0

  return (
    <View
      className={clsx(
        "absolute top-0 left-0 right-0 bottom-0",
        loaded ? "z-[2]" : "z-[0]",
      )}
    >
      <Pressable
        className="group absolute z-[20] top-4 right-4"
        style={{ marginTop: headerHeight }}
        onPress={closeView}
      >
        <Icon.MaterialCommunity
          name="close-circle-outline"
          size={42}
          className="text-[--foreground] group-active:text-[--foreground]"
        />
      </Pressable>

      <View className="flex-1 relative items-center justify-center bg-[--background]">
        <Zoomable minScale={0.5} isDoubleTapEnabled={true} maxPanPointers={1}>
          <View style={{ marginTop }}>
            {imageDefinition?.original ? (
              <RNImage
                source={{
                  uri: imageDefinition.original.asBase64({ dataURL: true }),
                }}
                onLoadEnd={() => setLoaded(true)}
                resizeMode="contain"
                width={imageWidth}
                height={imageHeight}
              />
            ) : null}
          </View>
        </Zoomable>
      </View>
    </View>
  )
}

function Row({
  plantImage,
  fullscreenPlantImage,
  setFullscreenPlantImage,
}: {
  plantImage: PlantImageType
  fullscreenPlantImage?: PlantImageType
  setFullscreenPlantImage: (plantImage: PlantImageType) => void
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
          <Pressable onPress={() => setFullscreenPlantImage(plantImage)}>
            {fullscreenPlantImage === plantImage ? (
              <ActivityIndicator
                size="large"
                className="absolute z-[1] top-1/2 left-1/2 -mt-[20] -ml-[20] text-[--foreground]"
              />
            ) : null}
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
