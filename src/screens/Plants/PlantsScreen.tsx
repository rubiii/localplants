import HeaderIconButton from "@/components/HeaderIconButton"
import HeaderView from "@/components/HeaderView"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import {
  MyAppAccount,
  PlantCollection,
  PlantCollectionType,
  PlantType,
} from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Haptics from "expo-haptics"
import { Image, useAccount, useCoState } from "jazz-tools/expo"
import { Pressable, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your Plants",
  headerRight: () => <HeaderRight />,
}

function HeaderRight() {
  const { navigation } = useNavigation<"Plants">()

  const openAccount = () => navigation.navigate("Account")

  return (
    <HeaderView>
      <HeaderIconButton
        icon="plus"
        community={true}
        onPress={() => navigation.navigate("AddCollection")}
      />
      <HeaderIconButton icon="account" community={true} onPress={openAccount} />
    </HeaderView>
  )
}

export default function PlantsScreen() {
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: { plants: true } } } },
  })

  return (
    <ScrollableScreenContainer className="px-4 pt-6 pb-4 gap-8">
      {me?.root.collections.map((collection) => (
        <PlantCollectionView
          key={collection.$jazz.id}
          shallowCollection={collection}
        />
      ))}
    </ScrollableScreenContainer>
  )
}

function PlantCollectionView({
  shallowCollection,
}: {
  shallowCollection: PlantCollectionType
}) {
  const collectionId = shallowCollection.$jazz.id

  const { navigation } = useNavigation<"Plants">()
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      sharedBy: true,
      plants: { $each: { primaryImage: { image: true } } },
    },
  })
  const collectionName = collection?.name || shallowCollection.name

  const openPlant = (plant: PlantType) => {
    if (!collection) return

    navigation.navigate("Plant", {
      title: plant.name,
      plantId: plant.$jazz.id,
      collectionId,
      readOnly: !!collection.sharedBy,
    })
  }
  const openCollection = () => {
    if (!collection) return

    navigation.navigate("Collection", {
      title: collectionName,
      collectionId,
      readOnly: !!collection.sharedBy,
    })
  }

  const plantsLoaded =
    collection?.plants !== null && collection?.plants !== undefined

  return (
    <View className="gap-1">
      <Pressable
        onPress={openCollection}
        className="group flex-row items-center"
      >
        <Text className="font-bold text-xl text-[--text]">
          {collectionName}
        </Text>

        <Icon.MaterialCommunity
          name="chevron-right"
          size={28}
          className="-ml-1 text-[--mutedText] group-active:text-[--primary]"
        />
      </Pressable>

      <View className="flex-row flex-wrap -m-1">
        {plantsLoaded ? (
          <>
            {collection.plants.map((plant) => (
              <PlantItem
                key={plant.$jazz.id}
                plant={plant}
                openPlant={openPlant}
              />
            ))}
          </>
        ) : (
          Array.from(Array(shallowCollection.plants?.length)).map(
            (_value, index) => <PlantItemSkeleton key={index} />,
          )
        )}
      </View>
    </View>
  )
}

function PlantItem({
  plant,
  openPlant,
}: {
  plant: PlantType
  openPlant: (plant: PlantType) => void
}) {
  const { navigation } = useNavigation<"Plants">()

  const openPlantImageModal = () => {
    if (!plant.primaryImage) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    navigation.navigate("PlantImageModal", {
      plantImageId: plant.primaryImage.$jazz.id,
    })
  }

  if (!plant.primaryImage?.image) return

  return (
    <Pressable
      onPress={() => openPlant(plant)}
      onLongPress={openPlantImageModal}
      key={plant.primaryImage.image.$jazz.id}
      className="w-4/12 p-1.5 aspect-square"
    >
      <Image
        imageId={plant.primaryImage.image.$jazz.id}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
        }}
        className="aspect-ratio"
        height={140}
        width={140}
      />
    </Pressable>
  )
}

function PlantItemSkeleton() {
  return (
    <View className="w-4/12 h-[140] p-1.5 aspect-square">
      <View
        className="w-full h-full animate-pulse bg-[--card]"
        style={{ borderRadius: 12 }}
      ></View>
    </View>
  )
}
