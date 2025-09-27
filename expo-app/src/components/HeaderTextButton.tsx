import { clsx } from "clsx"
import { Pressable, Text } from "react-native"

export default function HeaderTextButton({
  text,
  onPress,
  variant = "default",
  disabled = false,
}: {
  text: string
  onPress?: () => void
  variant?: "default" | "primary"
  disabled?: boolean
}) {
  return (
    <Pressable
      className="group p-2"
      onPress={() => !disabled && onPress && onPress()}
    >
      <Text
        className={clsx({
          "text-[--text] group-active:text-[--primary]":
            !disabled && variant === "default",
          "text-[--primary]": !disabled && variant === "primary",
          "text-[--mutedText]": disabled,
        })}
      >
        {text}
      </Text>
    </Pressable>
  )
}
