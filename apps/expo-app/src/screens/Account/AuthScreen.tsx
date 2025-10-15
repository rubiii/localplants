import { Button, Card, Icon, ListItem, Text } from "@/components/base"
import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import { MyAppAccount } from "@localplants/jazz/schema"
import { wordlist } from "@localplants/utils"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Clipboard from "expo-clipboard"
import { useAccount, usePassphraseAuth } from "jazz-tools/expo"
import { Platform, Pressable, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Authentication",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
}

function HeaderLeft() {
  const { navigation } = useNavigation<"Auth">()
  return <HeaderTextButton text="Close" onPress={() => navigation.goBack()} />
}

export default function AuthScreen() {
  const { navigation } = useNavigation<"Auth">()
  const auth = usePassphraseAuth({ wordlist })

  const { me } = useAccount(MyAppAccount, {
    resolve: { profile: true },
  })

  const copyPassphrase = () => {
    Clipboard.setStringAsync(auth.passphrase)
  }

  const signUp = () => {
    if (!me) return
    navigation.navigate("Login", { accountName: me.profile.name, signUp: true })
  }

  const openLogin = () => {
    if (!me) return
    navigation.navigate("Login", { accountName: me.profile.name })
  }

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-3">
      <Card className="gap-3">
        <ListItem>
          You’re currently not authenticated, which means your data is only
          stored locally on this device.
        </ListItem>
        <ListItem>
          You can keep working completely offline, but you will lose your data
          if you uninstall the app or lose this device.
        </ListItem>
        <ListItem>
          Opt-in to authentication at any time, keep the data you already
          created and enable additional features.
        </ListItem>
      </Card>

      <Card className="gap-3">
        <Text>
          Authenticate using the following passphrase.{"\n"}
          Just click to copy and store it somewhere save.{"\n"}
          When you’re ready click Sign up.
        </Text>

        <Pressable
          onPress={copyPassphrase}
          className="group flex-row px-5 py-3 rounded-2xl border border-[--mutedText]"
        >
          <View className="w-11/12">
            <Text weight={600} activeColor="primary">
              {auth.passphrase}
            </Text>
          </View>
          <View className="w-1/12 items-end justify-center">
            <Icon
              name="content-copy"
              size={20}
              color="muted"
              activeColor="primary"
            />
          </View>
        </Pressable>

        <View className="items-start">
          <Button title="Sign up" onPress={signUp} />
        </View>
      </Card>

      <View className="mt-2 gap-2">
        <Text>Already have an account?</Text>
        <View className="items-start">
          <Button title="Login again" onPress={openLogin} />
        </View>
      </View>
    </ScrollableScreenContainer>
  )
}
