import Text from "@/components/Text"
import { View } from "react-native"

export default function ListItem({
  text,
  size = "md",
}: {
  text: string
  size?: "md" | "lg"
}) {
  return (
    <View className="flex-row items-baseline">
      <View className="w-4">
        <Text size={size === "md" ? "xl" : "2xl"} className="leading-tight">
          •
        </Text>
      </View>
      <View className="flex-1">
        <Text size={size === "lg" ? "lg" : undefined} className="leading-tight">
          {text}
        </Text>
      </View>
    </View>
  )
}
