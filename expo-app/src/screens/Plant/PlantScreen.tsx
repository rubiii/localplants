import Icon from "@/components/Icon"
import IconButton from "@/components/IconButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import SmallButton from "@/components/SmallButton"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import useTheme from "@/hooks/useTheme"
import timeAgo from "@/lib/timeAgo"
import { Plant, type PlantImageType } from "@/schema"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { type RouteProp } from "@react-navigation/native"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FlashList } from "@shopify/flash-list/src"
import { LinearGradient } from "expo-linear-gradient"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import {
  ActivityIndicator,
  Pressable,
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
})

export default function PlantScreeen() {
  const { navigation, route } = useNavigation<"Plant">()
  const { plantId, collectionId, primaryImageId, title } = route.params

  const plant = useCoState(Plant, plantId, {
    resolve: { primaryImage: { image: true } },
  })
  const plantName = plant?.name || title

  // TODO: show age and date of death in case of loss
  let relativeAquiredAt = plant?.aquiredAt
    ? `${timeAgo(new Date(), new Date(plant.aquiredAt))} old`
    : ""

  useEffect(() => {
    if (!plant) return

    // update screen title when plant name changes
    navigation.setOptions({ title: plant.name })
  }, [plant, navigation])

  return (
    <ScrollableScreenContainer className="p-4">
      <PrimaryImageView primaryImageId={primaryImageId} />

      <Text className="pl-2.5 mt-4 text-[--text] font-semibold text-4xl text-center">
        {plant?.name || title}
      </Text>

      {relativeAquiredAt ? (
        <Text className="pl-2.5 text-[--secondaryText] text-center">
          Established: {relativeAquiredAt}
        </Text>
      ) : null}

      <MainButtonArea
        plantId={plantId}
        plantName={plantName}
        collectionId={collectionId}
      />
      <Identity plantId={plantId} plantName={plantName} />
      <Gradient />
      <ImageTimeline plantId={plantId} />
    </ScrollableScreenContainer>
  )
}

function PrimaryImageView({ primaryImageId }: { primaryImageId: string }) {
  const window = useWindowDimensions()
  const imageHeight = window.height / 1.7

  return (
    <View className="z-[100]">
      <Zoomable>
        <Image
          imageId={primaryImageId}
          resizeMode="cover"
          height="original"
          width="original"
          style={{
            height: imageHeight,
            width: "100%",
            borderRadius: 8,
          }}
        />
      </Zoomable>
    </View>
  )
}

function MainButtonArea({
  plantId,
  plantName,
  collectionId,
}: {
  plantId: string
  plantName: string
  collectionId: string
}) {
  const { navigation } = useNavigation<"Plant">()

  const addPhoto = () => {
    if (!plantId) return
    navigation.navigate("AddPlantImage", { plantId })
  }
  const sharePlant = () => {
    if (!plantId) return
    navigation.navigate("SharePlant", { plantId })
  }
  const editPlant = () => {
    if (!plantId || !plantName || !collectionId) return
    navigation.navigate("EditPlant", { plantId, plantName, collectionId })
  }

  return (
    <View className="pl-2.5 mt-2 flex flex-row items-center mx-auto">
      <SmallButton text="Edit" onPress={editPlant} />
      <IconButton icon="camera" onPress={addPhoto} />
      <SmallButton text="Share" onPress={sharePlant} />
    </View>
  )
}

function Identity({
  plantId,
  plantName,
}: {
  plantId: string
  plantName: string
}) {
  const { navigation } = useNavigation<"Plant">()
  const plant = useCoState(Plant, plantId, {
    resolve: { identity: { result: true } },
  })

  const openIdentity = () => {
    if (!plantId || !plantName) return

    navigation.navigate("Identity", { plantId, plantName })
  }

  if (!plant?.identity.result) {
    return (
      <SmallButton
        text="Identify this plant"
        onPress={openIdentity}
        className="mx-auto"
      />
    )
  }

  return (
    <Pressable onPress={openIdentity} className="mt-8 gap-4 items-center">
      <View className="items-center">
        <Text className="text-xs text-[--secondaryText]">Scientific name</Text>
        <Text className="text-xl leading-tight text-[--text]">
          {plant.identity.result.scientificName}
        </Text>
      </View>

      <View className="items-center">
        <Text className="text-xs text-[--secondaryText]">Genus</Text>
        <Text className="text-lg leading-tight text-[--text]">
          {plant.identity.result.scientificGenusName}
        </Text>
      </View>

      <View className="items-center">
        <Text className="text-xs text-[--secondaryText]">Family</Text>
        <Text className="text-lg leading-tight text-[--text]">
          {plant.identity.result.scientificFamilyName}
        </Text>
      </View>
    </Pressable>
  )
}

function ImageTimeline({ plantId }: { plantId: string }) {
  const plant = useCoState(Plant, plantId, {
    resolve: { images: { $each: true } },
  })

  if (!plant) {
    return <ActivityIndicator size="small" className="text-[--text] mx-auto" />
  }

  return (
    <FlashList
      data={plant.images}
      keyExtractor={(item, index) => item?.$jazz.id || index.toString()}
      renderItem={({ item }) =>
        item ? <PlantImageView plantImage={item} /> : null
      }
      numColumns={1}
    />
  )
}

function PlantImageView({ plantImage }: { plantImage: PlantImageType }) {
  const { navigation } = useNavigation<"Plant">()

  const createdAt = new Date(plantImage.$jazz.createdAt)
  const weekday = createdAt.toLocaleString(undefined, { weekday: "long" })
  const day = createdAt.toLocaleString(undefined, { day: "2-digit" })
  const month = createdAt.toLocaleString(undefined, { month: "long" })
  const year = createdAt.toLocaleString(undefined, { year: "numeric" })
  const time = createdAt.toLocaleString(undefined, {
    timeStyle: "short",
    hour12: true,
  })

  const openPlantImageModal = () => {
    navigation.navigate("PlantImageModal", {
      plantImageId: plantImage.$jazz.id,
    })
  }

  return (
    <View className="items-center gap-2">
      {plantImage.emote ? (
        <Icon.MaterialCommunity
          name={`emoticon-${plantImage.emote}-outline` as any}
          className="text-[--primary]"
          size={24}
        />
      ) : null}

      <View className="items-center gap-1">
        <Text className="text-[--secondaryText]">
          {weekday}, {day}. {month} {year}
        </Text>
        <Text className="text-[--mutedText]">{time}</Text>
      </View>

      {plantImage?.image ? (
        <View className="mt-2 w-full z-[100]">
          <Pressable onPress={openPlantImageModal}>
            <Image
              imageId={plantImage.image.$jazz.id}
              resizeMode="cover"
              height="original"
              width="original"
              style={{
                height: 220,
                width: "100%",
                borderRadius: 8,
              }}
            />
          </Pressable>
        </View>
      ) : null}

      {plantImage.note?.length ? (
        <Text className="text-lg mt-2 text-[--secondaryText]">
          {plantImage.note}
        </Text>
      ) : null}

      <Gradient />
    </View>
  )
}

function Gradient() {
  const { colors } = useTheme()

  return (
    <LinearGradient
      colors={[
        colors.background,
        colors.border,
        colors.border,
        colors.background,
      ]}
      locations={[0, 0.35, 0.65, 1]}
      dither={false}
      style={{
        width: 1,
        height: 60,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    />
  )
}
