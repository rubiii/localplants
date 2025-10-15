import { Text, Title } from "@/components/base"
import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation, { type RootStackParamList } from "@/hooks/useNavigation"
import { scaleToFit } from "@/lib/imageUtils"
import {
  PlantCollection,
  type PlantCollectionType,
  type PlantType,
} from "@localplants/jazz/schema"
import { timeAgo } from "@localplants/utils"
import { type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FlashList } from "@shopify/flash-list/src"
import * as Haptics from "expo-haptics"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import { Pressable, View } from "react-native"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "Collection">
}): NativeStackNavigationOptions => ({
  title: route.params.title,
  headerBackButtonDisplayMode: "minimal",
  headerRight: () => <HeaderRight />,
})

function HeaderRight() {
  const { navigation, route } = useNavigation<"Collection">()
  const { collectionId, readOnly } = route.params
  const collectionName = route.params.title

  const addPlant = () => navigation.navigate("AddPlant", { collectionId })
  const editCollection = () =>
    navigation.navigate("EditCollection", { collectionId, collectionName })

  return (
    <HeaderView>
      {readOnly ? null : (
        <HeaderIconButton icon="plus" community onPress={addPlant} />
      )}

      <HeaderIconButton icon="pencil" community onPress={editCollection} />
    </HeaderView>
  )
}

export default function CollectionScreen() {
  const { navigation, route } = useNavigation<"Collection">()
  const { collectionId } = route.params

  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      plants: { $each: { primaryImage: { image: true } } },
      sharedBy: true,
    },
  })

  useEffect(() => {
    if (!collection) return
    navigation.setOptions({ title: collection.name })
  }, [navigation, collection])

  return (
    <ScrollableScreenContainer className="px-4 py-6">
      <Title size="6xl" weight={900}>
        {collection?.name}
      </Title>

      <View className="-m-1 mt-3">
        <FlashList
          data={collection?.plants}
          keyExtractor={(item, index) => item?.$jazz.id || String(index)}
          numColumns={2}
          renderItem={({ item }) =>
            item ? (
              <PlantView
                key={item.$jazz.id}
                plant={item}
                collection={collection as PlantCollectionType}
              />
            ) : null
          }
        />
      </View>
    </ScrollableScreenContainer>
  )
}

function PlantView({
  plant,
  collection,
}: {
  plant: PlantType
  collection: PlantCollectionType
}) {
  const { navigation } = useNavigation<"Collection">()

  const openPlant = () => {
    if (!plant.primaryImage?.image) return

    navigation.navigate("Plant", {
      title: plant.name,
      plantId: plant.$jazz.id,
      primaryImageId: plant.primaryImage.image.$jazz.id,
      collectionId: collection.$jazz.id,
      readOnly: !!collection.sharedBy,
    })
  }

  const openPlantImageModal = () => {
    if (!plant.primaryImage) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    navigation.navigate("PlantImageModal", {
      plantImageId: plant.primaryImage.$jazz.id,
    })
  }

  if (!plant.images || !plant.primaryImage?.image) return

  let addedAt: string | undefined
  const lastImage = plant.images[plant.images.length - 1]
  if (lastImage?.$jazz.createdAt) {
    addedAt = timeAgo(new Date(), new Date(lastImage.$jazz.createdAt))
  }

  const { width, height } = scaleToFit(
    plant.primaryImage.image.originalSize,
    500
  )

  return (
    <Pressable
      key={plant.$jazz.id}
      onPress={openPlant}
      onLongPress={openPlantImageModal}
      className="group p-1.5 gap-2.5"
      style={{
        maxWidth: width,
        height: 200 + 60,
      }}
    >
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        resizeMode="cover"
        style={{
          maxWidth: "100%",
          height: 200,
          borderRadius: 8,
        }}
        height={width}
        width={height}
      />

      <View className="px-1 gap-0.5">
        <Text size="xl" activeColor="primary">
          {plant.name}
        </Text>
        {addedAt ? (
          <Text color="muted" size="sm">
            Added: {addedAt} ago
          </Text>
        ) : null}
      </View>
    </Pressable>
  )
}
