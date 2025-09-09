import Button from "@/components/Button"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Clipboard from "expo-clipboard"
import * as Linking from "expo-linking"
import { createInviteLink, useAccount, useCoState } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import QRCode from "react-qr-code"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Share Plant",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
}

function HeaderLeft() {
  const { navigation } = useNavigation<"SharePlant">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

export default function SharePlantScreen() {
  const { route } = useNavigation<"SharePlant">()
  const { plantId } = route.params

  const [inviteLink, setInviteLink] = useState<string>()
  const plant = useCoState(Plant, plantId)
  const { me } = useAccount(MyAppAccount, { resolve: { profile: true } })

  const generateInvite = () => {
    if (!plant || !me?.profile) return

    const baseLink = createInviteLink(plant, "reader")
    const baseLinkParts = baseLink.split("/")
    const inviteSecret = baseLinkParts.pop()
    const valueID = baseLinkParts.pop()
    const sharerID = me.$jazz.id
    const sharerName = me.profile.name

    const fullLink = Linking.createURL(
      `AcceptSharedPlant?valueID=${valueID}&inviteSecret=${inviteSecret}&sharerID=${sharerID}&sharerName=${sharerName}`,
    )

    setInviteLink(fullLink)
  }

  return (
    <ScrollableScreenContainer
      className="px-4 py-6"
      noPadding={Platform.OS === "android"}
    >
      {inviteLink ? (
        <QRCodeView inviteLink={inviteLink} />
      ) : (
        <InfoView generateInvite={generateInvite} />
      )}
    </ScrollableScreenContainer>
  )
}

function InfoView({ generateInvite }: { generateInvite: () => void }) {
  return (
    <View className="gap-12">
      <Text className="text-lg text-[--text]">
        Click the button to generate a QR code for someone to scan.
      </Text>

      <Button onPress={generateInvite} title="Generate QR code" size="large" />

      <View>
        <Text className="font-bold text-[--mutedText]">Privacy info:</Text>

        <View className="flex-row">
          <Text className="text-[--mutedText]">{"\u2022 "}</Text>
          <Text className="text-[--mutedText]">
            The other person will not be able to edit your data.
          </Text>
        </View>

        <View className="flex-row">
          <Text className="text-[--mutedText]">{"\u2022 "}</Text>
          <Text className="text-[--mutedText]">
            They will see all current and future data associated with this plant
            like photos and notes.
          </Text>
        </View>
      </View>
    </View>
  )
}

function QRCodeView({ inviteLink }: { inviteLink: string }) {
  const copyLink = () => Clipboard.setStringAsync(inviteLink)

  return (
    <View className="gap-12">
      <View className="mx-auto">
        <QRCode size={300} value={inviteLink} />
      </View>

      <View className="gap-2">
        <Text className="text-[--secondaryText]">
          You can also copy and share this link:
        </Text>

        <View className="px-5 py-0.5 rounded-lg bg-[--card]">
          <Pressable
            className="group flex-row items-center py-3"
            onPress={copyLink}
          >
            <Text className="flex-1 text-xs text-[--secondaryText]">
              {inviteLink}
            </Text>

            <Icon.Material
              name="content-copy"
              size={20}
              className="ml-3 text-[--secondaryText] group-active:text-[--background]"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
