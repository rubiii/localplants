import "@/global.css"
import { ThemeProvider } from "@/hooks/useTheme"
import Navigation from "@/Navigation"
import { MyAppAccount } from "@/schema"
import "@bam.tech/react-native-image-resizer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SplashScreen from "expo-splash-screen"
import { JazzExpoProvider } from "jazz-tools/expo"
import { StrictMode, useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({ duration: 300, fade: true })

const peer = process.env.EXPO_PUBLIC_JAZZ_PEER

export default function App() {
  const [skipWelcome, setSkipWelcome] = useState<boolean>()

  useEffect(() => {
    AsyncStorage.getItem("skip-welcome").then((value) => {
      setSkipWelcome(value === "true")
      SplashScreen.hideAsync()
    })
  }, [])

  return (
    <StrictMode>
      <JazzExpoProvider
        AccountSchema={MyAppAccount}
        sync={{ peer, when: "always" }}
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
