import {
  activeColorClasses,
  colorClasses,
  type FontSize,
  type FontWeight,
  textSizeClasses,
  type ThemeColor,
} from "@/theme"
import { clsx } from "clsx"
import { type ReactNode } from "react"
import { Text as RNText, type StyleProp, type TextStyle } from "react-native"

export default function Text(props: {
  color?: ThemeColor
  activeColor?: ThemeColor
  size?: FontSize
  weight?: FontWeight
  style?: StyleProp<TextStyle>
  className?: string
  children: ReactNode
}) {
  const { color, activeColor, size, weight, className, style, ...otherProps } =
    props

  const computedClassName = clsx(
    className,
    colorClasses(color),
    activeColorClasses(activeColor),
    textSizeClasses(size)
  )

  const defaultStyle = {
    fontFamily: "Calistoga_400Regular",
  }

  return (
    <RNText
      className={computedClassName}
      style={[style, defaultStyle]}
      {...otherProps}
    />
  )
}
