import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import IconButton from "@/components/IconButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import useNavigation from "@/hooks/useNavigation"
import { scaleToFit } from "@/lib/imageUtils"
import { MyAppAccount, PlantCollection, PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FlashList } from "@shopify/flash-list/src"
import * as Haptics from "expo-haptics"
import { Image, useAccount, useCoState } from "jazz-tools/expo"
import { Pressable, View } from "react-native"

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
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <FlashList
        data={me?.root.collections}
        keyExtractor={(item, index) => item?.$jazz.id || String(index)}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
        }}
        numColumns={1}
        renderItem={({ item }) =>
          item ? <PlantCollectionView collectionId={item.$jazz.id} /> : null
        }
      />
    </ScrollableScreenContainer>
  )
}

function PlantCollectionView({ collectionId }: { collectionId: string }) {
  const { navigation } = useNavigation<"Plants">()
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      sharedBy: true,
      plants: { $each: { primaryImage: { image: true } } },
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

  return (
    <View className="mb-12 gap-3">
      <Pressable onPress={openCollection} className="group">
        <Text size="6xl" weight={900} activeColor="primary">
          {collection?.name || "…"}
          <View className="pl-2">
            <IconButton
              onPress={openAddPlant}
              name="plus"
              community
              className="-mb-[2]"
            />
          </View>
        </Text>
      </Pressable>

      <FlashList
        data={collection?.plants}
        keyExtractor={(item, index) => item?.$jazz.id || String(index)}
        numColumns={2}
        className="-m-1"
        renderItem={({ item }) =>
          item ? (
            <PlantItem
              plant={item}
              onPress={openPlant}
              onLongPress={openPlantImageModal}
            />
          ) : null
        }
      />
    </View>
  )
}

function PlantItem({
  plant,
  onPress,
  onLongPress,
}: {
  plant: PlantType
  onPress: (plant: PlantType) => void
  onLongPress: (plant: PlantType) => void
}) {
  if (!plant.primaryImage?.image) return

  const { width, height } = scaleToFit(
    plant.primaryImage.image.originalSize,
    500,
  )

  return (
    <Pressable
      onPress={() => onPress(plant)}
      onLongPress={() => onLongPress(plant)}
      className="p-1.5 aspect-square"
    >
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
        }}
        height={width}
        width={height}
      />
    </Pressable>
  )
}

function PlantItemSkeleton() {
  return (
    <View className="w-4/12 h-[140] p-1.5 aspect-square">
      <View
        className="w-full h-full animate-pulse bg-[--card]"
        style={{ borderRadius: 8 }}
      ></View>
    </View>
  )
}
