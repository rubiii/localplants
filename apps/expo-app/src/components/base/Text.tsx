import {
  activeColorClasses,
  colorClasses,
  fontFamily,
  textSizeClasses,
  type FontSize,
  type FontWeight,
  type ThemeColor,
} from "@/theme"
import { clsx } from "clsx"
import { type ReactNode } from "react"
import { Text as RNText, type StyleProp, type TextStyle } from "react-native"

export default function Text(props: {
  color?: ThemeColor | undefined
  activeColor?: ThemeColor | undefined
  size?: FontSize | undefined
  weight?: FontWeight | undefined
  style?: StyleProp<TextStyle> | undefined
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
    fontFamily: fontFamily(weight),
  }

  return (
    <RNText
      className={computedClassName}
      style={[style, defaultStyle]}
      {...otherProps}
    />
  )
}
