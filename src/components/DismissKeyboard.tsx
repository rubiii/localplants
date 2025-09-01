import type { ReactNode } from "react"
import { Keyboard, Pressable } from "react-native"

export default function DismissKeyboard({ children }: { children: ReactNode }) {
  return (
    <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
      {children}
    </Pressable>
  )
}
