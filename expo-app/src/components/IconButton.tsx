import Icon from "@/components/Icon"
import { Pressable, View } from "react-native"

export default function IconButton({
  icon,
  onPress,
}: {
  icon: string
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} className="group">
      <View className="p-1 items-center justify-center">
        <Icon.Material
          name={icon as any}
          size={36}
          className="text-[--text] group-active:text-[--primary]"
        />
      </View>
    </Pressable>
  )
}
