import { type FontSize } from "@/theme"
import { type ReactNode } from "react"
import { View } from "react-native"
import Text from "./Text"

export default function ListItem({
  size,
  children,
}: {
  size?: FontSize
  children: ReactNode
}) {
  return (
    <View className="flex-row items-baseline">
      <View className="w-4">
        <Text size={size} className="leading-tight">
          •
        </Text>
      </View>
      <View className="flex-1">
        <Text size={size} className="leading-tight">
          {children}
        </Text>
      </View>
    </View>
  )
}
