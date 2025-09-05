import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Clipboard from "expo-clipboard"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Account",
  headerLargeTitle: true,
  headerRight: () => <HeaderRight />,
}

function HeaderRight() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable className="group p-2 -mr-2" onPress={toggleTheme}>
        <Icon.Material
          name={theme === "light" ? "dark-mode" : "light-mode"}
          className="text-[--foreground] group-active:text-[--primary]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}

export default function Account() {
  const { me, agent } = useAccount(MyAppAccount)
  const isAuthenticated = useIsAuthenticated()

  const isGuest = agent.$type$ !== "Account"
  const isAnonymous = agent.$type$ === "Account" && !isAuthenticated
  const accountID = me?.$jazz.id

  const copyAccountID = () => Clipboard.setStringAsync(accountID || "")

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 gap-8 pt-8 pb-12 px-5">
        <View className="gap-2">
          <Text className="text-[--foregroundSecondary]">Account ID</Text>

          <View className="px-5 py-0.5 rounded-xl bg-[--input]">
            <Pressable
              className="group flex-row items-center py-3"
              onPress={copyAccountID}
            >
              <Text className="flex-1 text-[--foreground]">{accountID}</Text>

              <Icon.Material
                name="content-copy"
                size={20}
                className="ml-3 text-[--foreground] group-active:text-[--background]"
              />
            </Pressable>
          </View>

          <Text className="flex-1 text-[--foreground]">
            You can share your Account ID and send it to a friend to
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-[--foregroundSecondary]">Account State</Text>

          <View className="flex-row items-center pl-5 pr-1 py-4 rounded-xl bg-[--input]">
            <Text className="flex-1 text-[--foreground]">
              {isGuest && "Guest mode"}
              {isAnonymous && "Anonymous account"}
              {isAuthenticated && "Authenticated"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
