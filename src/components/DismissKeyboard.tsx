import type { ReactNode } from "react"
import { Keyboard, Pressable } from "react-native"

export default function DismissKeyboard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <Pressable className={className} onPress={() => Keyboard.dismiss()}>
      {children}
    </Pressable>
  )
}
