import HeaderTextButton from "@/components/HeaderTextButton"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation, { RootStackParamList } from "@/hooks/useNavigation"
import useTheme from "@/hooks/useTheme"
import { contrast, hexToRgb } from "@/lib/colorUtils"
import { CustomTheme, CustomThemeType, MyAppAccount } from "@/schema"
import { Theme } from "@/theme"
import { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { clsx } from "clsx"
import * as Crypto from "expo-crypto"
import { useAccount } from "jazz-tools/expo"
import { useState } from "react"
import { Platform, Pressable, Text, View } from "react-native"
import ColorPicker, {
  ColorFormatsObject,
  HueSlider,
  Panel1,
  Preview,
} from "reanimated-color-picker"

export const routeOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, "CustomTheme">
}): NativeStackNavigationOptions => ({
  title: route.params?.customThemeName ? "Edit Theme" : "Create Theme",
  // On Android, the header title is not centered, but left aligned
  // and it's also placing a back arrow button if we pass undefined.
  headerLeft: () => (Platform.OS === "ios" ? <HeaderLeft /> : undefined),
  headerRight: () => <HeaderRight />,
})

function HeaderLeft() {
  const { navigation } = useNavigation<"CustomTheme">()
  return <HeaderTextButton text="Cancel" onPress={() => navigation.goBack()} />
}

function HeaderRight({ onSave }: { onSave?: () => void }) {
  return (
    <HeaderTextButton
      text="Save"
      variant="primary"
      onPress={onSave}
      disabled={!onSave}
    />
  )
}

function generateCustomThemeName() {
  return Crypto.randomUUID()
}

export default function CustomThemeScreen() {
  const { navigation, route } = useNavigation<"CustomTheme">()
  const customThemeName = route.params?.customThemeName

  const { theme, colors } = useTheme()
  const { me } = useAccount(MyAppAccount, {
    resolve: { profile: { themes: { $each: true } } },
  })

  const [activeColorKey, setActiveColorKey] = useState<keyof Theme>()
  const [themeColors, setThemeColors] = useState<Theme>(colors)

  if (!me?.profile) return

  const activeColorValue = activeColorKey
    ? themeColors[activeColorKey]
    : "#ffffff"

  const textBgContrast = contrast(
    hexToRgb(themeColors.background),
    hexToRgb(themeColors.text),
  )
  // TODO: communicate this contrast validation
  const valid = textBgContrast >= 1.5

  const createTheme = () => {
    console.log("CREATE THEME")
    const newCustomTheme = CustomTheme.create({
      name: generateCustomThemeName(),
      colors: themeColors,
    })
    me.profile.themes.$jazz.push(newCustomTheme)
    me.profile.$jazz.set("activeTheme", newCustomTheme)
    // setTheme(newCustomTheme.name)
  }
  const updateTheme = (existingTheme: CustomThemeType) => {
    console.log("UPDATE THEME")
    existingTheme.$jazz.set("colors", themeColors)
    // existingTheme.$jazz.set("name", generateCustomThemeName())
    // setTheme(existingTheme.name)
  }

  const saveTheme = () => {
    console.log("saving theme", themeColors)
    if (customThemeName) {
      if (me.profile.activeTheme) {
        updateTheme(me.profile.activeTheme)
      } else {
        createTheme()
      }
    } else {
      createTheme()
    }

    navigation.goBack()
  }

  setTimeout(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onSave={valid ? saveTheme : undefined} />,
    })
  }, 1)

  return (
    <ScrollableScreenContainer className="px-4 py-6 gap-2">
      <Text className="text-[--text]">{customThemeName}</Text>
      <Text className="text-[--text]">{theme}</Text>

      <View className="gap-1.5">
        <Text className="text-[--text]">Background Colors:</Text>
        <View className="flex-row -m-1">
          <ThemeColor
            label="Main"
            colorKey="background"
            value={themeColors.background}
            active={activeColorKey === "background"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Card"
            colorKey="card"
            value={themeColors.card}
            active={activeColorKey === "card"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Border"
            colorKey="border"
            value={themeColors.border}
            active={activeColorKey === "border"}
            onPress={setActiveColorKey}
          />
        </View>
      </View>

      <View className="gap-1.5">
        <Text className="text-[--text]">Text Colors:</Text>
        <View className="flex-row -m-1">
          <ThemeColor
            label="Main"
            colorKey="text"
            value={themeColors.text}
            active={activeColorKey === "text"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Scndry"
            colorKey="secondaryText"
            value={themeColors.secondaryText}
            active={activeColorKey === "secondaryText"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Muted"
            colorKey="mutedText"
            value={themeColors.mutedText}
            active={activeColorKey === "mutedText"}
            onPress={setActiveColorKey}
          />
        </View>
      </View>

      <View className="gap-1.5">
        <Text className="text-[--text]">Utility Colors:</Text>
        <View className="flex-row -m-1">
          <ThemeColor
            label="Primary"
            colorKey="primary"
            value={themeColors.primary}
            active={activeColorKey === "primary"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Success"
            colorKey="success"
            value={themeColors.success}
            active={activeColorKey === "success"}
            onPress={setActiveColorKey}
          />
          <ThemeColor
            label="Error"
            colorKey="error"
            value={themeColors.error}
            active={activeColorKey === "error"}
            onPress={setActiveColorKey}
          />
        </View>
      </View>

      {activeColorKey ? (
        <ColorPickerView
          value={activeColorValue}
          setValue={(value) =>
            setThemeColors({ ...themeColors, [activeColorKey]: value })
          }
        />
      ) : null}
    </ScrollableScreenContainer>
  )
}

function ThemeColor({
  label,
  colorKey,
  value,
  onPress,
  active = false,
}: {
  label: string
  colorKey: keyof Theme
  value: string
  onPress: (color: keyof Theme) => void
  active?: boolean
}) {
  return (
    <View className="p-1.5 mb-2 w-[72] items-center gap-1">
      <Pressable onPress={() => onPress(colorKey)}>
        <View
          className={clsx("w-full items-center aspect-square rounded-full", {
            "border-gray-600": !active,
            "border-white": active,
          })}
          style={{ backgroundColor: value, borderWidth: 4 }}
        >
          <View
            className="w-full aspect-square rounded-full border border-black"
            style={{ backgroundColor: value }}
          ></View>
        </View>
      </Pressable>

      <Text className="text-sm text-[--text]">{label}</Text>
    </View>
  )
}

function ColorPickerView({
  value,
  setValue,
}: {
  value: string
  setValue: (value: string) => void
}) {
  const updateColor = ({ hex }: ColorFormatsObject) => setValue(hex)

  return (
    <View className="p-2 rounded-lg bg-[--card]">
      <ColorPicker value={value} onCompleteJS={updateColor}>
        <View className="gap-1">
          <Preview />
          <Panel1 />
          <HueSlider />
        </View>
      </ColorPicker>
    </View>
  )
}
