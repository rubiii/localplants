import config from "@/config"
import "@/global.css"
import { ThemeProvider } from "@/hooks/useTheme"
import Navigation from "@/Navigation"
import { MyAppAccount } from "@/schema"
import "@bam.tech/react-native-image-resizer"
import { Inter_100Thin } from "@expo-google-fonts/inter/100Thin"
import { Inter_100Thin_Italic } from "@expo-google-fonts/inter/100Thin_Italic"
import { Inter_200ExtraLight } from "@expo-google-fonts/inter/200ExtraLight"
import { Inter_200ExtraLight_Italic } from "@expo-google-fonts/inter/200ExtraLight_Italic"
import { Inter_300Light } from "@expo-google-fonts/inter/300Light"
import { Inter_300Light_Italic } from "@expo-google-fonts/inter/300Light_Italic"
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular"
import { Inter_400Regular_Italic } from "@expo-google-fonts/inter/400Regular_Italic"
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium"
import { Inter_500Medium_Italic } from "@expo-google-fonts/inter/500Medium_Italic"
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold"
import { Inter_600SemiBold_Italic } from "@expo-google-fonts/inter/600SemiBold_Italic"
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold"
import { Inter_700Bold_Italic } from "@expo-google-fonts/inter/700Bold_Italic"
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold"
import { Inter_800ExtraBold_Italic } from "@expo-google-fonts/inter/800ExtraBold_Italic"
import { Inter_900Black } from "@expo-google-fonts/inter/900Black"
import { Inter_900Black_Italic } from "@expo-google-fonts/inter/900Black_Italic"
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
  const [skipWelcome, setSkipWelcome] = useState<boolean>()

  useEffect(() => {
    AsyncStorage.getItem("skip-welcome").then((value) => {
      setSkipWelcome(value === "true")
      SplashScreen.hideAsync()
    })
  }, [])

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Inter_100Thin_Italic,
    Inter_200ExtraLight_Italic,
    Inter_300Light_Italic,
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
    Inter_800ExtraBold_Italic,
    Inter_900Black_Italic,
  })

  if (!fontsLoaded) return null

  return (
    <StrictMode>
      <JazzExpoProvider
        AccountSchema={MyAppAccount}
        sync={{ peer: config.jazzSyncServer, when: "always" }}
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
