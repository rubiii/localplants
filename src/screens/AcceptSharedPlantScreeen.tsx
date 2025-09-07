import Button from "@/components/Button"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant, PlantCollection, PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useAccount } from "jazz-tools/expo"
import { SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Shared Plant Invite",
  headerLargeTitle: true,
}

export default function AcceptSharedPlantScreeen() {
  const { navigation, route } = useNavigation<"AcceptSharedPlant">()

  const valueID = route.params.value_id
  const inviteSecret = route.params.invite_secret
  const sharedByID = route.params.shared_by_id
  const sharedByName = route.params.shared_by_name
  const valid = valueID && inviteSecret && sharedByID && sharedByName

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: { plants: true } } } },
  })

  const acceptInvite = async () => {
    if (!me) return

    let plant: PlantType | null
    try {
      plant = await me.acceptInvite(valueID, inviteSecret, Plant)
    } catch (error) {
      console.error("Failed to accept invite", error)
      navigation.goBack()
      return
    }

    if (!plant) {
      console.debug("Got no plant for invite", { valueID, inviteSecret })
      navigation.goBack()
      return
    }

    const sharerCollection = me.root.collections.find(
      (collection) => collection.sharedBy?.accountID === sharedByID,
    )

    if (sharerCollection) {
      sharerCollection.plants.$jazz.unshift(plant)
    } else {
      const collection = PlantCollection.create(
        {
          name: `Shared by ${sharedByName || sharedByID}`,
          plants: [plant],
          sharedBy: {
            name: sharedByName,
            accountID: sharedByID,
            sharedAt: new Date().toISOString(),
          },
        },
        Group.create(),
      )
      me.root.collections.$jazz.push(collection)
    }

    navigation.goBack()
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 pt-8 pb-12 px-5">
        {valid ? (
          <>
            <View className="flex-1 gap-6">
              <Text className="text-[--foreground]">
                {sharedByName || sharedByID} wants to share
                {"\n"}
                one of their plants with you.
              </Text>
            </View>
            <Button onPress={acceptInvite} title="Accept" size="large" />
          </>
        ) : (
          <Text className="text-[--foreground]">Invalid Invite</Text>
        )}
      </View>
    </SafeAreaView>
  )
}
