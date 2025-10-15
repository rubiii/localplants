import { Icon } from "@/components/base"
import { clsx } from "clsx"
import { Pressable } from "react-native"

export default function HeaderIconButton({
  icon,
  onPress,
  community = false,
  disabled = false,
}: {
  icon: string
  onPress: () => void
  community?: boolean
  disabled?: boolean
}) {
  return (
    <Pressable
      className={clsx(
        "group p-1.5 w-9 items-center justify-center aspect-square rounded-full bg-[--card]",
        { "active:bg-[--primary]": !disabled },
      )}
      onPress={() => !disabled && onPress()}
    >
      <Icon
        name={icon as any}
        community={community}
        color={disabled ? "background" : undefined}
        activeColor="background"
        size={20}
      />
    </Pressable>
  )
}
