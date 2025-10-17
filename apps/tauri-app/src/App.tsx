import { MyAppAccount } from "@localplants/jazz/schema"
import { AnimatePresence } from "framer-motion"
import { JazzReactProvider } from "jazz-tools/react"
import { Route, Switch } from "wouter"
import "./App.css"
import AccountPage from "./pages/AccountPage"
import HomePage from "./pages/HomePage"
import PlantPage from "./pages/PlantPage"

type SyncServerUrl = `wss://${string}`
const jazzSyncServer = import.meta.env.VITE_JAZZ_SYNC_SERVER as SyncServerUrl

export default function App() {
  return (
    <JazzReactProvider
      AccountSchema={MyAppAccount}
      sync={{ peer: jazzSyncServer, when: "signedUp" }}
    >
      <AnimatePresence mode="popLayout">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/account" component={AccountPage} />

          <Route path="/plants/:id" component={PlantPage} />

          <Route>404: No such page!</Route>
        </Switch>
      </AnimatePresence>
    </JazzReactProvider>
  )
}
