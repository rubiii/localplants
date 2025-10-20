import "@/App.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import HomePage from "@/pages/HomePage"
import PlantPage from "@/pages/PlantPage"
import { MyAppAccount } from "@localplants/jazz/schema"
import { AnimatePresence } from "framer-motion"
import { JazzReactProvider } from "jazz-tools/react"
import { Route, Switch } from "wouter"

type SyncServerUrl = `wss://${string}`
const jazzSyncServer = import.meta.env["VITE_JAZZ_SYNC_SERVER"] as SyncServerUrl

export default function App() {
  return (
    <JazzReactProvider
      AccountSchema={MyAppAccount}
      sync={{ peer: jazzSyncServer, when: "signedUp" }}
    >
      <ThemeProvider>
        <AnimatePresence mode="popLayout">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/plants/:id" component={PlantPage} />

            <Route>404: No such page!</Route>
          </Switch>
        </AnimatePresence>
      </ThemeProvider>
    </JazzReactProvider>
  )
}
