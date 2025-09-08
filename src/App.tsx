import "@/global.css"
import useDeviceSettings from "@/hooks/useDeviceSettings"
import { ThemeProvider } from "@/hooks/useTheme"
import Navigation from "@/Navigation"
import { MyAppAccount } from "@/schema"
import "@bam.tech/react-native-image-resizer"
import { JazzExpoProvider } from "jazz-tools/expo"
import { StrictMode, useEffect, useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"

const peer = `wss://cloud.jazz.tools/?key=me@rubiii.com`

export default function App() {
  const settings = useDeviceSettings()
  const [skipWelcome, setSkipWelcome] = useState<boolean>()

  useEffect(() => {
    settings.hasValue("skip-welcome").then(setSkipWelcome)
  }, [settings])

  if (skipWelcome === undefined) return

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
                <Navigation skipWelcome={skipWelcome} />
              </ThemeProvider>
            </SafeAreaProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </JazzExpoProvider>
    </StrictMode>
  )
}
