import clsx from "clsx"
import { Pressable, Text } from "react-native"

export default function HeaderTextButton({
  text,
  onPress,
  disabled = false,
}: {
  text: string
  onPress?: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      className="group p-2"
      onPress={() => !disabled && onPress && onPress()}
    >
      <Text
        className={clsx({
          "text-[--text]": !disabled,
          "text-[--muted-text]": disabled,
        })}
      >
        {text}
      </Text>
    </Pressable>
  )
}
