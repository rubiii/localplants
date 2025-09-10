import useDeviceSettings from "@/hooks/useDeviceSettings"
import { CustomThemeType, MyAppAccount } from "@/schema"
import { defaultThemes, type Theme } from "@/theme"
import { useAccount } from "jazz-tools/expo"
import { vars } from "nativewind"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { Appearance, View } from "react-native"

interface ThemeContextType {
  theme: string
  usingCustomTheme: boolean
  resolvedTheme: string
  setTheme: (theme: string) => Promise<void>
  colors: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const DEFAULT_THEME = "light"

type CustomThemeName = string

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<
    "system" | "light" | "dark" | CustomThemeName
  >()
  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark" | CustomThemeName
  >()

  const settings = useDeviceSettings()
  const { me } = useAccount(MyAppAccount, {
    resolve: { profile: { activeTheme: { colors: true } } },
  })

  // Resolve stored theme on mount
  useEffect(() => {
    settings
      .getValue<string | undefined>("theme")
      .then((value) => setThemeState(value ?? "system"))
  }, [settings])

  // Listen to system changes if theme is "system"
  useEffect(() => {
    console.log("change?!")
    if (!theme) return
    console.log("chang!!!!!!!!!!!!")

    const colorScheme = Appearance.getColorScheme() ?? DEFAULT_THEME
    setResolvedTheme(theme === "system" ? colorScheme : theme)

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system" && colorScheme) setResolvedTheme(colorScheme)
    })

    return () => listener.remove()
  }, [theme])

  useEffect(() => {}, [me?.profile.activeTheme?.colors])

  const setTheme = async (theme: string) => {
    await settings.setValue("theme", theme)
    setThemeState(theme)
  }

  // We need to wait for several things until we can render :/
  if (!theme || !resolvedTheme || !me?.profile) return

  let colors: Theme
  let activeCustomTheme: CustomThemeType | undefined
  if (resolvedTheme === "light" || resolvedTheme === "dark") {
    colors = defaultThemes[resolvedTheme]
  } else {
    if (me.profile.activeTheme) {
      colors = me.profile.activeTheme.colors.toJSON()
    } else {
      colors = defaultThemes[DEFAULT_THEME]
    }
  }

  // TODO: remove throw after testing
  if (!colors)
    throw new Error("Unexpected error, this error was not expected :*")
  const nativewindStyles = vars(colors)

  return (
    <ThemeContext.Provider
      value={{
        theme: activeCustomTheme?.name ?? theme,
        usingCustomTheme: !!activeCustomTheme,
        resolvedTheme,
        setTheme,
        colors,
      }}
    >
      <View style={[{ flex: 1 }, nativewindStyles]}>{children}</View>
    </ThemeContext.Provider>
  )
}

const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}

export default useTheme
