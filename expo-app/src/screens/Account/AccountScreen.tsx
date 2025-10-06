import Button from "@/components/Button"
import HeaderTextButton from "@/components/HeaderTextButton"
import Icon from "@/components/Icon"
import ListItem from "@/components/ListItem"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import TextField from "@/components/TextField"
import useNavigation from "@/hooks/useNavigation"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@/schema"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, View } from "react-native"
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
  const { navigation } = useNavigation<"Account">()

  const { me } = useAccount(MyAppAccount, {
    resolve: { root: { plantNetApi: true }, profile: true },
  })
  const [name, setName] = useState(me?.profile.name)

  const isAuthenticated = useIsAuthenticated()
  const accountID = me?.$jazz.id

  const updateProfileName = (name?: string) => {
    if (!me?.profile) return
    me.profile.$jazz.set("name", name || "")
  }

  const openAuth = async () => {
    navigation.navigate("Auth")
  }

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-8">
      <TextField
        placeholder="Your account name"
        size="large"
        value={name}
        setValue={setName}
        onBlur={updateProfileName}
        note={`ID: ${accountID}`}
      />

      {isAuthenticated ? (
        <View className="gap-2">
          <Text className="ml-6 text-lg">You’re logged in.</Text>
        </View>
      ) : (
        <View className="gap-2">
          <Text className="ml-6 text-lg">Authentication</Text>
          <View className="px-5 py-3 rounded-lg bg-[--card]">
            <ListItem text="Keep your data if you lose this device" />
            <ListItem text="Share data with family and friends" />
            <ListItem text="Enable identification via Pl@ntNet" />
          </View>
          <View className="mt-1 ml-5 self-start">
            <Button
              onPress={openAuth}
              title="Learn more about authentication"
            />
          </View>
        </View>
      )}

      <ThemeSelect />
    </ScrollableScreenContainer>
  )
}

function ThemeSelect() {
  const { navigation } = useNavigation<"Account">()
  const {
    theme,
    setTheme,
    hasCustomTheme,
    removeCustomTheme,
    usesSystemTheme,
  } = useTheme()

  return (
    <View className="py-2 gap-2.5">
      <Text className="px-6 text-sm">Theme</Text>

      <View className="px-6 flex-row gap-3">
        <ThemeButton
          icon={Platform.OS === "ios" ? "apple" : "android"}
          size={24}
          community={true}
          onPress={() => setTheme("system")}
          active={usesSystemTheme}
        />
        <ThemeButton
          icon="light-mode"
          size={24}
          onPress={() => setTheme("light")}
          active={!usesSystemTheme && theme === "light"}
        />
        <ThemeButton
          icon="dark-mode"
          size={24}
          onPress={() => setTheme("dark")}
          active={!usesSystemTheme && theme === "dark"}
        />

        {hasCustomTheme ? (
          <ContextMenu
            onPress={({ nativeEvent: { index } }) => {
              if (index === 0) {
                navigation.navigate("CustomTheme")
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
              onPress={() => setTheme("custom")}
              active={theme === "custom"}
            />
          </ContextMenu>
        ) : null}

        {!hasCustomTheme ? (
          <Pressable
            onPress={() => navigation.navigate("CustomTheme")}
            className="w-14 aspect-square items-center justify-center rounded-lg border border-[--border]"
          >
            <Icon
              community
              name="plus"
              size={24}
              color={theme === "custom" ? undefined : "muted"}
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
  return (
    <Pressable
      onPress={onPress}
      className="w-14 aspect-square items-center justify-center rounded-lg border border-[--border]"
    >
      <Icon
        community={community}
        name={icon as any}
        size={size}
        color={active ? "text" : "muted"}
      />
    </Pressable>
  )
}
