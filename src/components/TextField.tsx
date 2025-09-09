import { clsx } from "clsx"
import { ReactNode } from "react"
import { Text, TextInput, View } from "react-native"

export default function TextField({
  value,
  setValue,
  placeholder,
  note,
  icon,
  onBlur,
  numberOfLines,
  multiline = false,
  autoFocus = false,
  size = "medium",
}: {
  value?: string
  setValue: (value?: string) => void
  placeholder?: string
  note?: string
  icon?: ReactNode
  onBlur?: (value?: string) => void
  numberOfLines?: number
  multiline?: boolean
  autoFocus?: boolean
  size?: "small" | "medium" | "large"
}) {
  return (
    <View className="gap-2">
      <View className="group py-4 border-b border-[--border]">
        <View className="flex-row items-end">
          <TextInput
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            value={value}
            autoFocus={autoFocus}
            onChangeText={setValue}
            onBlur={() => onBlur && onBlur(value)}
            className={clsx(
              "flex-1 px-6 py-0 text-[--text] placeholder:text-[--mutedText]",
              {
                "text-lg": size === "small",
                "text-xl": size === "medium",
                "text-2xl": size === "large",
              },
            )}
          />

          {icon ? <View className="px-6">{icon}</View> : null}
        </View>
      </View>

      {note ? <Text className="px-6 text-[--mutedText]">{note}</Text> : null}
    </View>
  )
}
