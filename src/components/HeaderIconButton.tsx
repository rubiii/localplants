import { Material, MaterialCommunity } from "@/components/Icon"
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
  const IconType = community ? MaterialCommunity : Material

  return (
    <Pressable
      className={clsx(
        "group p-1.5 w-9 items-center justify-center aspect-square rounded-full bg-[--card]",
        {
          "text-[--background] active:bg-[--primary]": !disabled,
          "text-[--muted-text]": disabled,
        },
      )}
      onPress={() => !disabled && onPress()}
    >
      <IconType
        name={icon as any}
        className={clsx({
          "text-[--text] group-active:text-[--background]": !disabled,
          "text-[--background]": disabled,
        })}
        size={20}
      />
    </Pressable>
  )
}
