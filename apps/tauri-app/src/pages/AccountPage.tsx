import AnimatedRoute from "@/components/AnimatedRoute"
import { wordlist } from "@localplants/utils"
import { usePassphraseAuth } from "jazz-tools/react"
import { useState } from "react"
import { useLocation } from "wouter"

export default function AccountPage() {
  const [, navigate] = useLocation()
  const auth = usePassphraseAuth({ wordlist })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [loginPassphrase, setLoginPassphrase] = useState("")

  const login = async () => {
    setBusy(true)

    try {
      await auth.logIn(loginPassphrase)
      navigate("/")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Unknown error")
      }
      setBusy(false)
    }
  }

  return (
    <AnimatedRoute backTo="/" title="Account">
      <form onSubmit={login} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Enter your passphrase"
            value={loginPassphrase}
            onChange={(event) => setLoginPassphrase(event.target.value)}
          />
          {error ? <div className="mt-1">{error}</div> : null}
        </div>

        <button type="submit" disabled={busy} className="self-start">
          Login
        </button>
      </form>
    </AnimatedRoute>
  )
}
