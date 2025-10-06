import {
  activeColorClasses,
  colorClasses,
  fontFamily,
  sizeClasses,
  type FontWeight,
} from "@/lib/themeUtils"
import { FontSize, ThemeColor } from "@/theme"
import { clsx } from "clsx"
import { ReactNode } from "react"
import { Text as RNText, StyleProp, TextStyle } from "react-native"

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
    sizeClasses(size),
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
