import Theme from "@/components/Theme"
import "@/global.css"
import Navigation from "@/Navigation"
import { MyAppAccount } from "@/schema"
import "@bam.tech/react-native-image-resizer"
import { JazzExpoProvider } from "jazz-tools/expo"
import { StrictMode } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const apiKey = "me@rubiii.com"

export default function App() {
  return (
    <StrictMode>
      <JazzExpoProvider
        AccountSchema={MyAppAccount}
        sync={{
          peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
          // when: "always", // When to sync: "always", "never", or "signedUp"
        }}
      >
        <GestureHandlerRootView>
          <Theme>
            <Navigation />
          </Theme>
        </GestureHandlerRootView>
      </JazzExpoProvider>
    </StrictMode>
  )
}
