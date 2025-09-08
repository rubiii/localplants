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
}: {
  value?: string
  setValue: (value?: string) => void
  placeholder?: string
  note?: string
  icon?: ReactNode
  onBlur?: (value?: string) => void
  multiline?: boolean
  numberOfLines?: number
  autoFocus?: boolean
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
            className="flex-1 px-6 py-0 text-xl text-[--foreground] placeholder:text-[--foregroundMuted]"
          />

          {icon ? <View className="px-6">{icon}</View> : null}
        </View>
      </View>

      {note ? (
        <Text className="px-6 text-[--foregroundMuted]">{note}</Text>
      ) : null}
    </View>
  )
}
