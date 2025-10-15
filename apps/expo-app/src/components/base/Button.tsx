import { type FontSize, textSizeClasses } from "@/theme"
import { clsx } from "clsx"
import { Pressable, type StyleProp, Text, type TextStyle } from "react-native"

type Variant = "primary" | "dangerous" | "disabled"

const VARIANTS: Record<Variant, Record<"wrapper" | "text", string>> = {
  primary: {
    wrapper: "bg-[--primary]",
    text: "text-[--background]",
  },
  dangerous: {
    wrapper: "bg-[--error]",
    text: "text-[--background]",
  },
  disabled: {
    wrapper: "bg-[--card]",
    text: "text-[--muted]",
  },
}

export type Props = {
  title: string
  onPress?: () => void
  variant?: Variant
  size?: FontSize
  style?: StyleProp<TextStyle>
  className?: string
  disabled?: boolean
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size,
  style,
  className,
  disabled = false,
}: Props) {
  const activeVariant = disabled ? "disabled" : variant

  const wrapperClasses = clsx(
    "px-4 py-3 rounded-lg",
    className,
    VARIANTS[activeVariant].wrapper
  )

  const textClasses = clsx(textSizeClasses(size), VARIANTS[activeVariant].text)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={wrapperClasses}
      style={style}
    >
      <Text className={textClasses}>{title}</Text>
    </Pressable>
  )
}
