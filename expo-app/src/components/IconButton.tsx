import Icon from "@/components/Icon"
import { clsx } from "clsx"
import { Pressable, View } from "react-native"

export default function IconButton({
  icon,
  onPress,
  className,
}: {
  icon: string
  onPress: () => void
  className?: string
}) {
  return (
    <Pressable onPress={onPress} className={clsx("group", className)}>
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
