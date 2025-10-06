import { clsx } from "clsx"
import { Text, View } from "react-native"

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
        <Text
          className={clsx("text-[--text] leading-tight", {
            "text-xl": size === "md",
            "text-2xl": size === "lg",
          })}
        >
          •
        </Text>
      </View>
      <View className="flex-1">
        <Text
          className={clsx("text-[--text] leading-tight", {
            "text-lg": size === "lg",
          })}
        >
          {text}
        </Text>
      </View>
    </View>
  )
}
