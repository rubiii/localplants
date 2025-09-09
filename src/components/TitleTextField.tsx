import { TextInput } from "react-native"

export default function TitleTextField({
  value,
  setValue,
  placeholder,
  onBlur,
}: {
  value?: string
  setValue: (value?: string) => void
  placeholder?: string
  onBlur?: (value?: string) => void
}) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={setValue}
      onBlur={() => onBlur && onBlur(value)}
      className="px-6 py-4 font-bold text-2xl text-center text-[--text] border-b border-[--border]"
    />
  )
}
