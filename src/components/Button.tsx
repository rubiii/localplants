import Icon from "@/components/Icon"
import useTheme from "@/hooks/useTheme"
import { clsx } from "clsx"
import { ActivityIndicator, Pressable, Text, View } from "react-native"

export default function Button({
  title,
  onPress,
  size = "medium",
  disabled = false,
  busy = false,
  icon = undefined,
}: {
  title?: string
  onPress?: any
  size?: string
  disabled?: boolean
  busy?: boolean
  icon?: string
}) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx("group flex-row items-center rounded-2xl", {
        "py-2 px-4 gap-1.5 inline-flex": size === "small",
        "py-4 px-6 gap-2 inline-flex": size === "medium",
        "py-6 px-8 gap-3": size === "large",
        "bg-[--primary] active:text-[--foreground]": !disabled,
        "bg-[--backgroundSecondary]": disabled,
      })}
    >
      {busy || icon ? (
        <View className=" -ml-1">
          {busy ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}

          {!busy && icon ? (
            <Icon.Material
              name={icon as any}
              size={16}
              className="text-[--primaryForeground]"
            />
          ) : null}
        </View>
      ) : null}

      <Text
        className={clsx({
          "text-xl": size === "large",
          "text-[--primaryForeground]": !disabled,
          "text-[--foregroundMuted]": disabled,
        })}
      >
        {title}
      </Text>
    </Pressable>
  )
}
