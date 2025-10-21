import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import { IconButton, Title } from "@/components/base"
import useNavigation from "@/hooks/useNavigation"
import { scaleToFit } from "@/lib/imageUtils"
import {
  MyAppAccount,
  Plant,
  PlantCollection,
  type PlantType,
} from "@localplants/jazz/schema"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FlashList } from "@shopify/flash-list/src"
import * as Haptics from "expo-haptics"
import { Image, useAccount, useCoState } from "jazz-tools/expo"
import { Pressable, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your Plants",
  // Disable navigating back to welcome flow
  headerLeft: () => <></>,
  headerRight: () => <HeaderRight />,
}

function HeaderRight() {
  const { navigation } = useNavigation<"Plants">()

  const openAccount = () => navigation.navigate("Account")
  const openAddCollection = () => navigation.navigate("AddCollection")

  return (
    <HeaderView>
      <HeaderIconButton icon="plus" community onPress={openAddCollection} />
      <HeaderIconButton icon="account" community onPress={openAccount} />
    </HeaderView>
  )
}

export default function HomeScreen() {
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  return (
    <FlashList
      data={me?.root.collections}
      keyExtractor={(item, index) => item?.$jazz.id || String(index)}
      maintainVisibleContentPosition={{
        autoscrollToTopThreshold: 0,
      }}
      className="pt-36 pb-6 px-4 bg-[--background]"
      numColumns={1}
      renderItem={({ item }) =>
        item ? <PlantCollectionView collectionId={item.$jazz.id} /> : null
      }
    />
  )
}

function PlantCollectionView({ collectionId }: { collectionId: string }) {
  const { navigation } = useNavigation<"Plants">()
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      sharedBy: true,
      plants: { $each: true },
    },
  })

  const openPlant = (plant: PlantType) => {
    if (!collection || !plant.primaryImage?.image) return

    navigation.navigate("Plant", {
      title: plant.name,
      plantId: plant.$jazz.id,
      primaryImageId: plant.primaryImage.image.$jazz.id,
      collectionId,
      readOnly: !!collection.sharedBy,
    })
  }

  const openPlantImageModal = (plant: PlantType) => {
    if (!plant.primaryImage) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    navigation.navigate("PlantImageModal", {
      plantImageId: plant.primaryImage.$jazz.id,
    })
  }

  const openCollection = () => {
    if (!collection) return

    navigation.navigate("Collection", {
      title: collection.name,
      collectionId,
      readOnly: !!collection.sharedBy,
    })
  }

  const openAddPlant = () => {
    navigation.navigate("AddPlant", { collectionId })
  }

  const gap = 8
  const numCols = 2
  const itemGap = (gap * (numCols - 1)) / numCols

  return (
    <View className="mb-12 gap-3">
      <View className="flex flex-row items-start">
        <Pressable onPress={openCollection} className="group flex-1 flex-shrink">
          <Title size="5xl" weight={900} activeColor="primary">
            {collection?.name || "…"}
          </Title>
        </Pressable>
        <View className="pl-2 mt-1.5 flex-shrink-0">
          <IconButton onPress={openAddPlant} name="plus" community />
        </View>
      </View>

      <FlashList
        data={collection?.plants}
        keyExtractor={(item, index) => item?.$jazz.id || String(index)}
        numColumns={numCols}
        renderItem={({ item, index }) => {
          const marginLeft = ((index % numCols) / (numCols - 1)) * itemGap
          const marginRight = itemGap - marginLeft

          return (
            <View
              style={{
                flexGrow: 1,
                marginLeft,
                marginRight,
                borderRadius: 8,
                overflow: "hidden"
              }}
            >
              <PlantListItem
                plantId={item?.$jazz.id}
                onPress={openPlant}
                onLongPress={openPlantImageModal}
              />
            </View>
          )
        }}
      />
    </View>
  )
}

function PlantListItem({
  plantId,
  onPress,
  onLongPress,
}: {
  plantId?: string
  onPress: (plant: PlantType) => void
  onLongPress: (plant: PlantType) => void
}) {
  const opacity = useSharedValue(0)
  const plant = useCoState(Plant, plantId, {
    resolve: { primaryImage: { image: true } },
  })

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value }
  })

  const fadeIn = () => {
    opacity.value = withTiming(1, { duration: 1000 })
  }

  const { width, height } = plant
    ? scaleToFit(plant.primaryImage.image.originalSize, 500)
    : { width: 500, height: 500 }

  return (
    <Pressable
      onPress={() => plant && onPress(plant)}
      onLongPress={() => plant && onLongPress(plant)}
      className="aspect-square relative"
    >
      <Animated.View style={animatedStyle} className="absolute w-full h-full z-10">
        {plant ? (
          <Image
            imageId={plant.primaryImage.image.$jazz.id}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
            height={height}
            width={width}
            onLoadEnd={fadeIn}
          />
        ) : null}
      </Animated.View>

      <View className="w-full h-full animate-pulse bg-[--card]" />
    </Pressable >
  )
}
