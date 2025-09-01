import useTheme from "@/hooks/useTheme"
import { clsx } from "clsx"
import { ActivityIndicator, Pressable, Text } from "react-native"

export default function Button({
  title,
  onPress,
  size = "medium",
  disabled = false,
  busy = false,
}: {
  title?: string
  onPress?: any
  size?: string
  disabled?: boolean
  busy?: boolean
}) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx("group flex-row gap-3 rounded-2xl", {
        "py-2 px-4": size === "small",
        "py-4 px-6": size === "medium",
        "py-6 px-8": size === "large",
        "bg-[--primary] group-active:text-[--foreground]": !disabled,
        "bg-[--backgroundSecondary]": disabled,
      })}
    >
      {busy ? <ActivityIndicator size="small" color={colors.primary} /> : null}

      <Text
        className={clsx({
          "text-xl": size === "large",
          "text-[--primaryForeground]": !disabled,
          "text-[--background]": disabled,
        })}
      >
        {title}
      </Text>
    </Pressable>
  )
}
