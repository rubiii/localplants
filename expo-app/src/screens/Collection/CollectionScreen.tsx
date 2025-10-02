import HeaderContextMenu from "@/components/HeaderContextMenu"
import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import timeAgo from "@/lib/timeAgo"
import { PlantCollection, PlantCollectionType, PlantType } from "@/schema"
import { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { FlashList } from "@shopify/flash-list/src"
import * as Haptics from "expo-haptics"
import { Image, useCoState } from "jazz-tools/expo"
import { useEffect } from "react"
import { Pressable, Text, View } from "react-native"

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

  return (
    <HeaderView>
      {readOnly ? null : (
        <HeaderIconButton
          icon="plus"
          community={true}
          onPress={() => navigation.navigate("AddPlant", { collectionId })}
        />
      )}

      <HeaderContextMenu
        icon="dots-horizontal"
        onPress={(index) => {
          if (index === 0) {
            navigation.navigate("EditCollection", {
              collectionId,
              collectionName,
            })
          } else if (index === 1) {
            navigation.navigate("RemoveCollection", {
              collectionId,
              collectionName,
            })
          }
        }}
        actions={[
          { title: "Edit Collection", systemIcon: "square.and.pencil" },
          {
            title: "Remove Collection",
            systemIcon: "trash",
            destructive: true,
          },
        ]}
      />
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
    <ScrollableScreenContainer className="px-4 py-2">
      <View className="-m-1 mt-3">
        <FlashList
          data={collection?.plants}
          keyExtractor={(item, index) => item?.$jazz.id || index.toString()}
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

  return (
    <Pressable
      key={plant.$jazz.id}
      onPress={openPlant}
      onLongPress={openPlantImageModal}
      className="group gap-2 mb-16 aspect-square"
    >
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 8,
        }}
        height={140}
        width={140}
      />

      <View>
        <Text className="text-[--text] group-active:text-[--primary]">
          {plant.name}
        </Text>
        {addedAt ? (
          <Text className="text-xs text-[--secondaryText]">
            Added: {addedAt} ago
          </Text>
        ) : null}
      </View>
    </Pressable>
  )
}
