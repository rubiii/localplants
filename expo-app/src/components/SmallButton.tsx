import Text from "@/components/Text"
import { clsx } from "clsx"
import { Pressable, View } from "react-native"

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
        <Text color="secondary" activeColor="background">
          {text}
        </Text>
      </View>
    </Pressable>
  )
}
