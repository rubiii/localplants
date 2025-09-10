import { ReactNode } from "react"
import { View } from "react-native"

export default function HeaderView({ children }: { children: ReactNode }) {
  return <View className="flex-row gap-3 align-baseline">{children}</View>
}
