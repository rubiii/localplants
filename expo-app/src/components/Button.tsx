import Text from "@/components/Text"
import { clsx } from "clsx"
import { Pressable } from "react-native"

export default function Button({
  title,
  onPress,
  className,
  size = "medium",
  disabled = false,
}: {
  title?: string
  onPress?: any
  className?: string
  size?: string
  disabled?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx([
        "group rounded-lg",
        {
          "py-2 px-4 gap-1.5": size === "small",
          "py-4 px-6 gap-2": size === "medium",
          "py-6 px-12 gap-3": size === "large",
          "bg-[--primary] active:bg-[--card]": !disabled,
          "bg-[--card]": disabled,
        },
        className,
      ])}
    >
      <Text
        size={size === "large" ? "xl" : undefined}
        color={disabled ? "muted" : "background"}
      >
        {title}
      </Text>
    </Pressable>
  )
}
