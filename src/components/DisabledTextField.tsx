import Icon from "@/components/Icon"
import { clsx } from "clsx"
import * as Clipboard from "expo-clipboard"
import { Pressable, Text, View } from "react-native"

export default function DisabledTextField({
  label,
  value,
  note,
  size = "medium",
  copyButton = false,
}: {
  label: string
  value?: string
  note?: string
  size?: "small" | "medium" | "large"
  copyButton?: boolean
}) {
  const onPress = () => {
    if (!copyButton) return
    Clipboard.setStringAsync(value || "")
  }

  return (
    <View className="gap-2">
      <Pressable
        onPress={onPress}
        className="group gap-1 py-4 border-b border-[--border]"
      >
        <Text className="px-6 text-sm text-[--foreground]">{label}</Text>

        <View className="flex-row">
          <Text
            className={clsx("flex-1 px-6 text-[--foregroundMuted]", {
              "text-lg": size === "small",
              "text-xl": size === "medium",
              "text-2xl": size === "large",
            })}
          >
            {value}
          </Text>

          {copyButton ? (
            <Icon.Material
              name="content-copy"
              size={20}
              className="pr-6 text-[--foregroundMuted] group-active:text-[--primary]"
            />
          ) : null}
        </View>
      </Pressable>

      {note ? (
        <Text className="px-6 text-[--foregroundMuted]">{note}</Text>
      ) : null}
    </View>
  )
}
