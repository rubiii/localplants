import HeaderContextMenu from "@/components/HeaderContextMenu"
import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
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
        icon="camera-plus"
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
      {plant ? (
        <View className="flex-1 -mt-[580]">
          <View className="w-[30] h-[600] border-r border-[--border]"></View>

          {plant.images.map((plantImage) => (
            <PlantImageView
              key={plantImage.$jazz.id.toString()}
              plantImage={plantImage}
              fullscreenPlantImage={fullscreenPlantImage}
              setFullscreenPlantImage={setFullscreenPlantImage}
            />
          ))}

          <View className="w-[30] h-full border-r border-[--border]"></View>
        </View>
      ) : null}

      {fullscreenPlantImage ? (
        <FullscreenPlantImage
          plantImage={fullscreenPlantImage}
          closeView={() => {
            setFullscreenPlantImage(undefined)
          }}
        />
      ) : null}
    </ScrollableScreenContainer>
  )
}

function PlantImageView({
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
          <Text className="text-lg mt-2 mb-2 text-[--foregroundSecondary]">
            {plantImage.note}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

function FullscreenPlantImage({
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
