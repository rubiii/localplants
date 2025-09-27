import { ReactNode } from "react"
import { StyleProp, View, ViewStyle } from "react-native"

export default function HeaderView({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={style} className="flex-row gap-3 align-baseline">
      {children}
    </View>
  )
}
