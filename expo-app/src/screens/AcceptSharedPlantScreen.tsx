import Button from "@/components/Button"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant, PlantCollection, PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group } from "jazz-tools"
import { useAccount } from "jazz-tools/expo"
import { View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Plant Invite",
}

export default function AcceptSharedPlantScreen() {
  const { navigation, route } = useNavigation<"AcceptSharedPlant">()

  const { valueID, inviteSecret, sharerID, sharerName } = route.params
  const valid = valueID && inviteSecret && sharerID && sharerName

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
      (collection) => collection.sharedBy?.accountID === sharerID,
    )

    if (sharerCollection) {
      sharerCollection.plants.$jazz.unshift(plant)
    } else {
      const collection = PlantCollection.create(
        {
          name: `Shared by ${sharerName || sharerID}`,
          // TODO: get hemisphere from sender
          hemisphere: "north",
          plants: [plant],
          sharedBy: {
            name: sharerName,
            accountID: sharerID,
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
    <ScrollableScreenContainer className="p-4">
      {valid ? (
        <>
          <View className="flex-1 gap-6">
            <Text>
              {sharerName || sharerID} wants to share
              {"\n"}
              one of their plants with you.
            </Text>
          </View>
          <Button onPress={acceptInvite} title="Accept" size="large" />
        </>
      ) : (
        <Text>Invalid Invite</Text>
      )}
    </ScrollableScreenContainer>
  )
}
