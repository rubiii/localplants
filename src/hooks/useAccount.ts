import {
  useIsAuthenticated,
  useAccount as useJazzAccount,
} from "jazz-tools/expo"

export default function useAccount() {
  const { agent } = useJazzAccount()
  const isAuthenticated = useIsAuthenticated()

  // Check if guest mode is enabled in JazzReactProvider
  const isGuest = agent.$type$ !== "Account"

  // Anonymous authentication: has an account but not fully authenticated
  const isAnonymous = agent.$type$ === "Account" && !isAuthenticated

  return {
    isGuest,
    isAnonymous,
    isAuthenticated,
  }
}
