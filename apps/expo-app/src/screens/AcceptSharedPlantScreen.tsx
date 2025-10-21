import { Button, Text } from "@/components/base"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { acceptPlantInvite } from "@localplants/jazz"
import {
  MyAppAccount
} from "@localplants/jazz/schema"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
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

    const result = await acceptPlantInvite({ me, valueID, inviteSecret, sharerID, sharerName })
    if (!result) {
      // TODO: handle invite problem?
      navigation.goBack()
      return
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
          <Button onPress={acceptInvite} title="Accept" size="xl" />
        </>
      ) : (
        <Text>Invalid Invite</Text>
      )}
    </ScrollableScreenContainer>
  )
}
