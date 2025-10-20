import Button from "@/components/Button"
import Modal, { type ModalProps } from "@/components/Modal"
import TextField from "@/components/TextField"
import { wordlist } from "@localplants/utils"
import { usePassphraseAuth } from "jazz-tools/react"
import { useState } from "react"
import { useLocation } from "wouter"

export default function AccountModal({ isOpen, setIsOpen }: ModalProps) {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col gap-12">
        <Login />
      </div>
    </Modal>
  )
}

function Login() {
  const [, navigate] = useLocation()
  const auth = usePassphraseAuth({ wordlist })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [loginPassphrase, setLoginPassphrase] = useState("")

  const login = async (): Promise<void> => {
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
    <form onSubmit={(e) => { e.preventDefault(); void login() }} className="flex flex-col gap-1">
      <div>
        <TextField
          name="passphrase"
          placeholder="Enter your passphrase"
          value={loginPassphrase}
          onChange={setLoginPassphrase}
        />
        {error ? <div className="mt-1">{error}</div> : null}
      </div>

      <Button type="submit" disabled={busy} className="self-start">
        Login
      </Button>
    </form >
  )
}
