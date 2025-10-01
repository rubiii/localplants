import { clsx } from "clsx"
import { Pressable, Text, View } from "react-native"

export default function SmallButton({
  text,
  onPress,
  className,
}: {
  text: string
  onPress: () => void
  className?: string
}) {
  return (
    <Pressable onPress={onPress} className={clsx("group py-3 px-2", className)}>
      <View
        className={clsx(
          "py-1 px-5 items-center justify-center border border-[--border] rounded-full",
          "group-active:bg-[--primary] group-active:border-[--primary]",
        )}
      >
        <Text className="text-[--secondaryText] group-active:text-[--background]">
          {text}
        </Text>
      </View>
    </Pressable>
  )
}
