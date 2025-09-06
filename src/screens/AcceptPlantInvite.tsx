import Button from "@/components/Button"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant, PlantCollection, PlantType } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Group, InviteSecret } from "jazz-tools"
import { useAccount } from "jazz-tools/expo"
import { useEffect, useState } from "react"
import { SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Accept Plant Invite",
  headerLargeTitle: true,
}

type Invite = {
  valueID: string
  inviteSecret: InviteSecret
  sharedBy: { id: string; name: string }
}

export default function AcceptPlantInvite() {
  const [invite, setInvite] = useState<Invite>()
  const [invalid, setInvalid] = useState(false)
  const { navigation, route } = useNavigation<"AcceptPlantInvite">()

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { collections: { $each: { plants: true } } } },
  })

  const acceptInvite = async () => {
    if (!me || !invite) return

    let plant: PlantType
    try {
      plant = (await me.acceptInvite(
        invite.valueID,
        invite.inviteSecret,
        Plant,
      )) as PlantType
    } catch (error) {
      console.error("Failed to accept invite", error)
      navigation.goBack()
      return
    }

    if (!plant) {
      console.debug("Got no plant for invite", invite)
      navigation.goBack()
      return
    }

    const sharerCollection = me.root.collections.find(
      (collection) => collection.sharedBy?.accountID === invite.sharedBy.id,
    )

    if (sharerCollection) {
      sharerCollection.plants.$jazz.unshift(plant)
    } else {
      const collection = PlantCollection.create(
        {
          name: `Shared by ${invite.sharedBy.name || invite.sharedBy.id}`,
          plants: [plant],
          sharedBy: {
            name: invite.sharedBy.name,
            accountID: invite.sharedBy.id,
            sharedAt: new Date().toISOString(),
          },
        },
        Group.create(),
      )
      me.root.collections.$jazz.push(collection)
    }

    navigation.goBack()
  }

  // TODO: does this need to be a effect?
  useEffect(() => {
    const valueID = route.params.value_id
    const inviteSecret = route.params.invite_secret
    const sharedByID = route.params.shared_by_id
    const sharedByName = route.params.shared_by_name

    if (valueID && inviteSecret && sharedByID && sharedByName) {
      setInvite({
        valueID,
        inviteSecret,
        sharedBy: { id: sharedByID, name: sharedByName },
      })
    } else {
      setInvalid(true)
    }
  }, [route])

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 pt-8 pb-12 px-5">
        {invite ? (
          <Button onPress={acceptInvite} title="Accept" size="large" />
        ) : null}

        {invalid ? (
          <Text className="text-[--foreground]">Invalid Invite</Text>
        ) : null}
      </View>
    </SafeAreaView>
  )
}
