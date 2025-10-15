import { useState } from "react"
import Button, { type Props as ButtonProps } from "./Button"

export type Props = ButtonProps & {
  confirm: string
}

type ConfirmationState = "initial" | "confirm" | "confirmed"

export default function ConfirmButton({
  title,
  confirm,
  onPress,
  disabled,
  ...props
}: Props) {
  const [state, setState] = useState<ConfirmationState>("initial")
  const handlePress = () => {
    if (state === "initial") {
      setState("confirm")
    } else {
      setState("confirmed")
      onPress && onPress()
    }
  }

  return (
    <Button
      onPress={handlePress}
      title={state === "initial" ? title : confirm}
      disabled={state === "confirmed" || disabled}
      {...props}
    />
  )
}
