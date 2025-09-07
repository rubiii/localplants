import DismissKeyboard from "@/components/DismissKeyboard"
import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Clipboard from "expo-clipboard"
import { AnonymousJazzAgent, Loaded } from "jazz-tools"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native"

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

export default function AccountScreen() {
  const { me, agent } = useAccount(MyAppAccount)

  const updateProfileName = (name: string) =>
    me?.profile?.$jazz.set("name", name)

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <DismissKeyboard>
        <View className="flex-1 gap-8 pt-8 pb-12 px-5">
          <ProfileName value={me?.profile?.name} onChange={updateProfileName} />
          <AccountState agent={agent} />
          <AccountID accountID={me?.$jazz.id} />
        </View>
      </DismissKeyboard>
    </SafeAreaView>
  )
}

function ProfileName({
  value,
  onChange,
}: {
  value?: string
  onChange: (name: string) => void
}) {
  const [name, setName] = useState(value)

  return (
    <View className="gap-2">
      <Text className="text-lg text-[--foregroundSecondary]">Your name</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        onBlur={() => onChange(name || "")}
        className="px-6 py-4 text-xl leading-tight text-[--foregroundSecondary] bg-[--input] rounded-lg"
      />
    </View>
  )
}

function AccountState({
  agent,
}: {
  agent: AnonymousJazzAgent | Loaded<typeof MyAppAccount, true>
}) {
  const isAuthenticated = useIsAuthenticated()
  const isAnonymous = agent.$type$ === "Account" && !isAuthenticated
  const isGuest = agent.$type$ !== "Account"

  return (
    <View className="gap-2">
      <Text className="text-[--foregroundSecondary]">Account State</Text>

      <View className="flex-row items-center pl-5 pr-1 py-4 rounded-lg bg-[--input]">
        <Text className="flex-1 text-[--foregroundMuted]">
          {isGuest && "Guest mode"}
          {isAnonymous && "Anonymous account"}
          {isAuthenticated && "Authenticated"}
        </Text>
      </View>
    </View>
  )
}

function AccountID({ accountID }: { accountID?: string }) {
  const copyAccountID = () => Clipboard.setStringAsync(accountID || "")

  return (
    <View className="gap-2">
      <Text className="text-[--foregroundSecondary]">Account ID</Text>

      <View className="px-5 py-0.5 rounded-lg bg-[--input]">
        <Pressable
          className="group flex-row items-center py-3"
          onPress={copyAccountID}
        >
          <Text className="flex-1 text-[--foregroundSecondary]">
            {accountID}
          </Text>

          <Icon.Material
            name="content-copy"
            size={20}
            className="ml-3 text-[--foregroundSecondary] group-active:text-[--background]"
          />
        </Pressable>
      </View>
    </View>
  )
}
