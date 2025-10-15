import config from "@/config"
import "@/global.css"
import { ThemeProvider } from "@/hooks/useTheme"
import Navigation from "@/navigation/Navigation"
import { fonts } from "@/theme"
import "@bam.tech/react-native-image-resizer"
import { MyAppAccount } from "@localplants/jazz/schema"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { JazzExpoProvider } from "jazz-tools/expo"
import { StrictMode, useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({ duration: 300, fade: true })

export default function App() {
  const [skipWelcome, setSkipWelcome] = useState<boolean | undefined>()
  const [fontsLoaded] = useFonts(fonts)

  useEffect(() => {
    AsyncStorage.getItem("skip-welcome").then((value) =>
      setSkipWelcome(value === "true")
    )
  }, [])

  useEffect(() => {
    if (skipWelcome === undefined || !fontsLoaded) return
    SplashScreen.hideAsync()
  }, [skipWelcome, fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <StrictMode>
      <JazzExpoProvider
        AccountSchema={MyAppAccount}
        sync={{ peer: config.jazzSyncServer, when: "signedUp" }}
      >
        <GestureHandlerRootView>
          <KeyboardProvider>
            <SafeAreaProvider>
              <ThemeProvider>
                {skipWelcome === undefined ? null : (
                  <Navigation skipWelcome={skipWelcome} />
                )}
              </ThemeProvider>
            </SafeAreaProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </JazzExpoProvider>
    </StrictMode>
  )
}
