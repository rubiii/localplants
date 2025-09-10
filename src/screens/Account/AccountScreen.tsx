import DisabledTextField from "@/components/DisabledTextField"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon, { Material, MaterialCommunity } from "@/components/Icon"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import ContextMenu from "react-native-context-menu-view"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Account",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
}

function HeaderLeft() {
  const { navigation } = useNavigation<"Account">()
  return <HeaderTextButton text="Close" onPress={() => navigation.goBack()} />
}

export default function AccountScreen() {
  const { usingCustomTheme, setTheme } = useTheme()
  const { me, agent } = useAccount(MyAppAccount, {
    resolve: { profile: { activeTheme: true, themes: true } },
  })
  const [name, setName] = useState(me?.profile.name)

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

  const removeCustomTheme = () => {
    if (!me?.profile) return

    me.profile.$jazz.set("themes", [])
    me.profile.$jazz.set("activeTheme", undefined)

    if (usingCustomTheme) setTheme("system")
  }

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <TextField
        placeholder="Account name"
        size="large"
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

      <ThemeSelect
        customThemeName={me?.profile.activeTheme?.name}
        canAddCustomTheme={!me?.profile.themes.length || false}
        removeCustomTheme={removeCustomTheme}
      />
    </ScrollableScreenContainer>
  )
}

function ThemeSelect({
  customThemeName,
  canAddCustomTheme,
  removeCustomTheme,
}: {
  customThemeName?: string
  canAddCustomTheme: boolean
  removeCustomTheme: () => void
}) {
  const { navigation } = useNavigation<"Account">()
  const { theme, setTheme } = useTheme()

  return (
    <View className="py-4 gap-2.5">
      <Text className="px-6 text-sm text-[--text]">Theme</Text>

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

        {customThemeName ? (
          <ContextMenu
            onPress={({ nativeEvent: { index } }) => {
              if (index === 0) {
                navigation.navigate("CustomTheme", { customThemeName })
              } else if (index === 1) {
                removeCustomTheme()
              }
            }}
            dropdownMenuMode={true}
            actions={[
              { title: "Edit Theme", systemIcon: "pencil" },
              {
                title: "Remove Theme",
                systemIcon: "trash",
                destructive: true,
              },
            ]}
          >
            <ThemeButton
              icon="account"
              community={true}
              size={24}
              onPress={() => setTheme(customThemeName)}
              active={theme === customThemeName}
            />
          </ContextMenu>
        ) : null}

        {canAddCustomTheme ? (
          <Pressable
            onPress={() => navigation.navigate("CustomTheme")}
            className="w-14 aspect-square items-center justify-center rounded-lg border border-[--border]"
          >
            <Icon.MaterialCommunity
              name="plus"
              size={24}
              className={clsx({
                "text-[--text]": theme === "custom",
                "text-[--mutedText]": theme !== "custom",
              })}
            />
          </Pressable>
        ) : null}
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
          "text-[--text]": active,
          "text-[--mutedText]": !active,
        })}
      />
    </Pressable>
  )
}
