import Button from "@/components/Button"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import ListItem from "@/components/ListItem"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import useNavigation from "@/hooks/useNavigation"
import wordlist from "@/lib/wordlist"
import { MyAppAccount } from "@/schema"
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
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <View className="max-w-[280] gap-4">
        <ListItem
          size="lg"
          text="You’re currently not authenticated, which means your data is only
        stored locally on this device."
        />
        <ListItem
          size="lg"
          text="You can keep working completely offline, but it also means you will lose your data if
          you lose this device."
        />
        <ListItem
          size="lg"
          text="Opt-in to authentication at any time, keep the data you already created and enable additional features."
        />
      </View>

      <View className="mt-4 gap-3">
        <Text>
          Authenticate using the following passphrase.{"\n"}
          Just click to copy it and store it somewhere save.{"\n"}
          When you’re ready click Sign up.
        </Text>

        <Pressable
          onPress={copyPassphrase}
          className="group flex-row px-5 py-3 rounded-lg bg-[--card]"
        >
          <View className="w-10/12">
            <Text>{auth.passphrase}</Text>
          </View>
          <View className="w-2/12 items-end justify-center">
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
      </View>

      <View className="gap-2">
        <Text>Aready have an account?</Text>
        <View className="items-start">
          <Button title="Login" onPress={openLogin} />
        </View>
      </View>
    </ScrollableScreenContainer>
  )
}
