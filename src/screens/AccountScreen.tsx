import DisabledTextField from "@/components/DisabledTextField"
import { Material, MaterialCommunity } from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Account",
}

export default function AccountScreen() {
  const { me, agent } = useAccount(MyAppAccount)
  const [name, setName] = useState(me?.profile?.name)

  const isAuthenticated = useIsAuthenticated()
  const isAnonymous = agent.$type$ === "Account" && !isAuthenticated
  const isGuest = agent.$type$ !== "Account"

  let accountState
  if (isGuest) {
    accountState = "Guest mode"
  } else if (isAnonymous) {
    accountState = "Anonymous account"
  } else if (isAuthenticated) {
    accountState = "Authenticated"
  }
  const accountID = me?.$jazz.id

  const updateProfileName = (name?: string) => {
    if (!me?.profile) return
    me.profile.$jazz.set("name", name || "")
  }

  return (
    <ScrollableScreenContainer className="p-4 gap-8">
      <TextField
        placeholder="Account name"
        value={name}
        setValue={setName}
        onBlur={updateProfileName}
        note="When you share a plant or a collection, your account name at that time will be shared as well."
      />

      <DisabledTextField label="Account State" value={accountState} />

      <DisabledTextField
        label="Account ID"
        value={accountID}
        size="small"
        copyButton={true}
        note="Click to copy into clipboard."
      />

      <ThemeSelect />
    </ScrollableScreenContainer>
  )
}

function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <View className="py-4 gap-2.5">
      <Text className="px-6 text-sm text-[--foreground]">Theme</Text>

      <View className="px-6 flex-row gap-3">
        <ThemeButton
          icon={Platform.OS === "ios" ? "apple" : "android"}
          size={24}
          community={true}
          onPress={() => setTheme("system")}
          active={theme === "system"}
        />
        <ThemeButton
          icon="light-mode"
          size={24}
          onPress={() => setTheme("light")}
          active={theme === "light"}
        />
        <ThemeButton
          icon="dark-mode"
          size={24}
          onPress={() => setTheme("dark")}
          active={theme === "dark"}
        />
      </View>
    </View>
  )
}

function ThemeButton({
  icon,
  size,
  onPress,
  community = false,
  active = false,
}: {
  icon: string
  size: number
  onPress: () => void
  community?: boolean
  active?: boolean
}) {
  const IconType = community ? MaterialCommunity : Material

  return (
    <Pressable
      onPress={onPress}
      className="w-14 aspect-square items-center justify-center rounded-lg border border-[--border]"
    >
      <IconType
        name={icon as any}
        size={size}
        className={clsx({
          "text-[--foreground]": active,
          "text-[--foregroundMuted]": !active,
        })}
      />
    </Pressable>
  )
}
