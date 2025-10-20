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
import { useThemeContext } from "@/lib/theme/ThemeProvider"
import { MyAppAccount } from "@localplants/jazz/schema"
import { THEME_COLORS, themePrimaryColors, type ThemeColor } from "@localplants/theme"
import { type NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import { useAccount, useIsAuthenticated } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, View } from "react-native"

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

      <ThemeModeSelect />
      <ThemeColorSelect />
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
        <Text size="xl">You&apos;re logged in</Text>
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

function ThemeModeSelect() {
  const { mode, setMode } = useThemeContext()
  const systemIcon = Platform.OS === "ios"
    ? "apple"
    : (Platform.OS === "android" ? "android" : "devices")

  return (
    <Card className="py-2 gap-2.5">
      <Text size="2xl" weight={900}>
        Theme Mode
      </Text>
      <Text size="base" className="-mt-2 mb-3">
        Choose between light, dark, or system theme.
      </Text>

      <View className="flex-row gap-3">
        <ThemeButton
          icon={systemIcon}
          label="System"
          community={true}
          onPress={() => setMode("system")}
          active={mode === "system"}
        />
        <ThemeButton
          icon="light-mode"
          label="Light"
          onPress={() => setMode("light")}
          active={mode === "light"}
        />
        <ThemeButton
          icon="dark-mode"
          label="Dark"
          onPress={() => setMode("dark")}
          active={mode === "dark"}
        />
      </View>
    </Card>
  )
}

function ThemeColorSelect() {
  const { color, setColor } = useThemeContext()

  return (
    <Card className="py-2 gap-2.5">
      <Text size="2xl" weight={900}>
        Theme Color
      </Text>
      <Text size="base" className="-mt-2 mb-3">
        Choose your preferred accent color.
      </Text>

      <View className="flex-row gap-3 flex-wrap">
        {THEME_COLORS.map((themeColor) => (
          <ThemeColorButton
            key={themeColor}
            color={themeColor}
            onPress={() => setColor(themeColor)}
            active={color === themeColor}
          />
        ))}
      </View>
    </Card>
  )
}

function ThemeButton({
  icon,
  label,
  onPress,
  community = false,
  active = false,
}: {
  icon: string
  label: string
  onPress: () => void
  community?: boolean
  active?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "px-3 py-2 flex-row items-center gap-2 rounded-lg border",
        {
          "border-[--border] bg-[--background]": !active,
          "border-[--text]": active,
        }
      )}
    >
      <Icon community={community} name={icon as any} size={20} color="text" />
      <Text
        size="base"
        className={clsx({
          "text-[--background]": active,
          "text-[--text]": !active,
        })}
      >
        {label}
      </Text>
    </Pressable>
  )
}

function ThemeColorButton({
  color,
  onPress,
  active = false,
}: {
  color: ThemeColor
  onPress: () => void
  active?: boolean
}) {
  const colorMap = themePrimaryColors

  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "px-4 py-2 flex-row items-center gap-2 rounded-lg border capitalize",
        {
          "border-[--border] bg-[--background]": !active,
          "border-[--text]": active,
        }
      )}
    >
      <View
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: colorMap[color] }}
      />
      <Text size="base" style={{ color: colorMap[color] }} >
        {color}
      </Text>
    </Pressable>
  )
}
