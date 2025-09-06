import Button from "@/components/Button"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, PlantCollection, PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { Image, useAccount, useCoState } from "jazz-tools/expo"
import { Pressable, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your plants",
  headerLargeTitle: true,
  headerRight: () => <HeaderRight />,
}

function HeaderRight() {
  const { navigation } = useNavigation()

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      {/* <Pressable className="group p-2" onPress={() => navigate("AddPlant")}>
        <Icon.Material
          name="add-circle-outline"
          className="text-[--primaryForeground] group-active:text-[--foreground]"
          size={24}
        />
      </Pressable> */}

      <Pressable
        className="group p-2 -mr-2"
        onPress={() => navigation.navigate("Account")}
      >
        <Icon.MaterialCommunity
          name="account-circle-outline"
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}

export default function Plants() {
  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: true } } },
  })

  const addCollection = () => {}

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <ScrollView className="py-8 px-5">
        <View className="flex flex-row justify-end">
          <Button
            title="Add collection"
            onPress={addCollection}
            icon="add-circle-outline"
            size="small"
          />
        </View>

        <View className="gap-8">
          {me?.root.collections.map((collection) => (
            <PlantCollectionView
              key={collection.$jazz.id}
              collectionId={collection.$jazz.id}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function PlantCollectionView({ collectionId }: { collectionId: string }) {
  const { navigation } = useNavigation()
  const collection = useCoState(PlantCollection, collectionId, {
    resolve: {
      sharedBy: true,
      plants: { $each: { primaryImage: { image: true } } },
    },
  })

  const addPlant = () => navigation.navigate("AddPlant", { collectionId })
  const gotoPlant = (plant: PlantType) => {
    if (!collection) return

    navigation.navigate("PlantDetails", {
      title: plant.name,
      plantId: plant.$jazz.id,
      collectionId,
      readOnly: !!collection.sharedBy,
    })
  }

  return (
    <View>
      <Text className="text-lg text-[--foreground]">{collection?.name}</Text>

      <View className="flex-row flex-wrap -m-1 mt-2">
        {(collection?.plants || []).map((plant) => (
          <PlantItem key={plant.$jazz.id} plant={plant} gotoPlant={gotoPlant} />
        ))}

        {!collection || collection.sharedBy ? null : (
          <AddPlantButton onPress={addPlant} />
        )}
      </View>
    </View>
  )
}

function PlantItem({
  plant,
  gotoPlant,
}: {
  plant: PlantType
  gotoPlant: (plant: PlantType) => void
}) {
  if (!plant.primaryImage?.image) return

  return (
    <Pressable
      onPress={() => gotoPlant(plant)}
      key={plant.primaryImage.image.$jazz.id}
      className="w-4/12 p-1 aspect-square"
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

function AddPlantButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="group w-4/12 p-1 aspect-square items-center justify-center"
    >
      <View
        className={clsx(
          "h-full w-full flex items-center justify-center rounded-xl border border-[--border]",
          "group-active:bg-[--primary] group-active:border-[--primary]",
        )}
      >
        <Icon.MaterialCommunity
          name="plus"
          className="text-[--primary] group-active:text-[--background]"
          size={42}
        />
      </View>
    </Pressable>
  )
}
