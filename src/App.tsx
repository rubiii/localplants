import { JazzExpoProvider } from "jazz-tools/expo"
import React, { StrictMode } from "react"
import PermissionsScreen from "./Permissions"
import "./global.css"

const apiKey = "me@rubiii.com"

export default function App() {
  return (
    <StrictMode>
      <JazzExpoProvider sync={{ peer: `wss://cloud.jazz.tools/?key=${apiKey}` }}>
        <PermissionsScreen />
      </JazzExpoProvider>
    </StrictMode>
  )
}
