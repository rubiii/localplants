import { Text } from "@/components/base"
import { Pressable } from "react-native"

export default function HeaderTextButton({
  text,
  onPress,
  variant = "default",
  disabled = false,
}: {
  text: string
  onPress?: (() => void) | undefined
  variant?: "default" | "primary"
  disabled?: boolean
}) {
  return (
    <Pressable
      className="group p-2"
      onPress={() => !disabled && onPress && onPress()}
    >
      <Text
        color={
          disabled ? "muted" : variant === "primary" ? "primary" : undefined
        }
        activeColor={variant === "default" ? "primary" : undefined}
      >
        {text}
      </Text>
    </Pressable>
  )
}
