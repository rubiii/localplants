import { clsx } from "clsx"
import { type ReactNode } from "react"
import { type StyleProp, type TextStyle, View } from "react-native"

export default function Card({
  className,
  style,
  children,
}: {
  style?: StyleProp<TextStyle>
  className?: string
  children: ReactNode
}) {
  return (
    <View className={clsx("px-6 pt-4 pb-5 rounded-2xl bg-[--card]", className)}>
      {children}
    </View>
  )
}
