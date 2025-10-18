import {
  Button,
  Card,
  ConfirmButton,
  Icon,
  ListItem,
  Text,
  TextField,
} from "@/components/base"
import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import useTheme from "@/hooks/useTheme"
import { MyAppAccount } from "@localplants/jazz/schema"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, View } from "react-native"
import ContextMenu from "react-native-context-menu-view"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your Account",
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

  const { me, logOut } = useAccount(MyAppAccount, {
    resolve: { profile: true },
  })
  const [name, setName] = useState(me?.profile.name)

  const isAuthenticated = useIsAuthenticated()
  const accountID = me?.$jazz.id

  const updateProfileName = (name?: string) => {
    if (!me?.profile) return
    me.profile.$jazz.set("name", name || "")
  }

  const openAuth = async () => navigation.navigate("Auth")
  const handleLogOut = () => {
    logOut()
    navigation.popToTop()
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
        <LoggedInCard logOut={handleLogOut} />
      ) : (
        <LoggedOutCard openAuth={openAuth} />
      )}

      <ThemeSelect />
    </ScrollableScreenContainer>
  )
}

function LoggedOutCard({ openAuth }: { openAuth: () => void }) {
  return (
    <Card>
      <Text size="2xl" weight={900} className="mb-4">
        Authentication
      </Text>

      <View className="mb-4">
        <ListItem>Keep your data if you lose this device</ListItem>
        <ListItem>Share plants with family and friends</ListItem>
        <ListItem>Enable identification via Pl@ntNet</ListItem>
      </View>

      <View className="self-start">
        <Button onPress={openAuth} title="Learn more" />
      </View>
    </Card>
  )
}

function LoggedInCard({ logOut }: { logOut: () => void }) {
  return (
    <Card>
      <Text size="2xl" weight={900} className="mb-4">
        Authentication
      </Text>

      <View className="mb-1 flex-row gap-1.5 items-center">
        <Icon name="check-circle-outline" community size={18} color="success" />
        <Text size="xl">You’re logged in</Text>
      </View>

      <Text className="mb-4 text-sm">
        You can log out but everything added while being logged out will not be
        there when you log back in.
      </Text>

      <View className="self-start">
        <ConfirmButton
          onPress={logOut}
          title="Log out"
          confirm="Are you sure you want to log out?"
          variant="dangerous"
        />
      </View>
    </Card>
  )
}

function ThemeSelect() {
  const { navigation } = useNavigation<"Account">()
  const {
    theme,
    setTheme,
    hasCustomTheme,
    removeCustomTheme, // TODO: expand on themes
    usesSystemTheme,
  } = useTheme()

  return (
    <Card className="py-2 gap-2.5">
      <Text size="2xl" weight={900}>
        Theme
      </Text>
      <Text size="base" className="-mt-2 mb-3">
        Select a theme or create your own.
      </Text>

      <View className="flex-row gap-3">
        <ThemeButton
          icon={Platform.OS === "ios" ? "apple" : "android"}
          community={true}
          onPress={() => setTheme("system")}
          active={usesSystemTheme}
        />
        <ThemeButton
          icon="light-mode"
          onPress={() => setTheme("light")}
          active={!usesSystemTheme && theme === "light"}
        />
        <ThemeButton
          icon="dark-mode"
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
              onPress={() => setTheme("custom")}
              active={theme === "custom"}
            />
          </ContextMenu>
        ) : null}

        {!hasCustomTheme ? (
          <Pressable
            onPress={() => navigation.navigate("CustomTheme")}
            className="w-14 aspect-square items-center justify-center rounded-lg border border-[--secondaryText]"
          >
            <Icon
              community
              name="plus"
              size={24}
              color={theme === "custom" ? undefined : "secondary"}
            />
          </Pressable>
        ) : null}
      </View>
    </Card>
  )
}

function ThemeButton({
  icon,
  onPress,
  community = false,
  active = false,
}: {
  icon: string
  onPress: () => void
  community?: boolean
  active?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "w-14 aspect-square items-center justify-center rounded-lg border",
        {
          "border-[--border]": !active,
          "text-[--backgorund] bg-[--text] border-[--text]": active,
        }
      )}
    >
      <Icon
        community={community}
        name={icon as any}
        size={24}
        color={active ? "background" : "secondary"}
      />
    </Pressable>
  )
}
