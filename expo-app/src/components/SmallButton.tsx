import { clsx } from "clsx"
import { Pressable, Text, View } from "react-native"

export default function SmallButton({
  text,
  onPress,
}: {
  text: string
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} className="group py-3 px-2">
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
