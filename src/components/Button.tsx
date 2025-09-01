import useTheme from "@/hooks/useTheme"
import { clsx } from "clsx"
import { ActivityIndicator, Pressable, Text } from "react-native"

export default function Button({
  title,
  onPress,
  disabled = false,
  busy = false,
}: {
  title?: string
  onPress?: any
  disabled?: boolean
  busy?: boolean
}) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx("flex-row gap-3 rounded-2xl py-6 px-8", {
        "bg-[--primary]": !disabled,
        "bg-[--backgroundSecondary]": disabled,
      })}
    >
      {busy ? <ActivityIndicator size="small" color={colors.primary} /> : null}

      <Text
        className={clsx("text-xl", {
          "text-[--primaryForeground]": !disabled,
          "text-[--background]": disabled,
        })}
      >
        {title}
      </Text>
    </Pressable>
  )
}
