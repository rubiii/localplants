import Button from "@/components/Button"
import Icon from "@/components/Icon"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount, Plant } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Clipboard from "expo-clipboard"
import * as Linking from "expo-linking"
import { createInviteLink, useAccount, useCoState } from "jazz-tools/expo"
import { useState } from "react"
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native"
import QRCode from "react-qr-code"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Share plant",
}

export default function SharePlantScreen() {
  const { route } = useNavigation<"SharePlant">()
  const plantId = route.params.plantId

  const [inviteLink, setInviteLink] = useState<string>()
  const plant = useCoState(Plant, plantId)
  const { me } = useAccount(MyAppAccount, { resolve: { profile: true } })

  const generateInvite = () => {
    if (!plant || !me?.profile) return

    const baseLink = createInviteLink(plant, "reader")
    const baseLinkParts = baseLink.split("/")
    const inviteSecret = baseLinkParts.pop()
    const objectID = baseLinkParts.pop()
    const sharedById = me.$jazz.id
    const sharedByName = me.profile.name

    const fullLink = Linking.createURL(
      `IncomingPlantShare?value_id=${objectID}&invite_secret=${inviteSecret}&shared_by_id=${sharedById}&shared_by_name=${sharedByName}`,
    )

    setInviteLink(fullLink)
  }

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <ScrollView className="py-8 px-5">
        {inviteLink ? (
          <QRCodeView inviteLink={inviteLink} />
        ) : (
          <InfoView generateInvite={generateInvite} />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function InfoView({ generateInvite }: { generateInvite: () => void }) {
  return (
    <View className="gap-12">
      <Text className="text-lg text-[--foreground]">
        Click the button to generate a QR code for someone to scan.
      </Text>

      <Button onPress={generateInvite} title="Generate QR code" size="large" />

      <View>
        <Text className="font-bold text-[--foregroundMuted]">
          Privacy info:
        </Text>

        <View className="flex-row">
          <Text className="text-[--foregroundMuted]">{"\u2022 "}</Text>
          <Text className="text-[--foregroundMuted]">
            The other person will not be able to edit your data.
          </Text>
        </View>

        <View className="flex-row">
          <Text className="text-[--foregroundMuted]">{"\u2022 "}</Text>
          <Text className="text-[--foregroundMuted]">
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
        <Text className="text-[--foregroundSecondary]">
          You can also copy and share this link:
        </Text>

        <View className="px-5 py-0.5 rounded-lg bg-[--input]">
          <Pressable
            className="group flex-row items-center py-3"
            onPress={copyLink}
          >
            <Text className="flex-1 text-xs text-[--foregroundSecondary]">
              {inviteLink}
            </Text>

            <Icon.Material
              name="content-copy"
              size={20}
              className="ml-3 text-[--foregroundSecondary] group-active:text-[--background]"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
