import { clsx } from "clsx"
import { type ReactNode } from "react"
import { TextInput, View } from "react-native"
import Text from "./Text"

export default function TextField({
  value,
  setValue,
  placeholder,
  note,
  icon,
  onBlur,
  numberOfLines,
  maxLength,
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
  maxLength?: number
  multiline?: boolean
  autoFocus?: boolean
  size?: "small" | "medium" | "large"
}) {
  return (
    <View className="gap-1">
      <View className="group py-4 rounded-2xl bg-[--card]">
        <View className="flex-row items-end">
          <TextInput
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={numberOfLines}
            value={value}
            autoFocus={autoFocus}
            onChangeText={setValue}
            maxLength={maxLength}
            onBlur={() => onBlur && onBlur(value)}
            className={clsx(
              "flex-1 px-6 py-0 text-[--text] placeholder:text-[--mutedText]",
              {
                "text-lg": size === "small",
                "text-xl": size === "medium",
                "text-2xl leading-tight": size === "large",
              }
            )}
          />

          {icon ? <View className="px-6">{icon}</View> : null}
        </View>
      </View>

      {note ? (
        <Text color="secondary" className="px-6">
          {note}
        </Text>
      ) : null}
    </View>
  )
}
