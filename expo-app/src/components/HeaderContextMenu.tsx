import Icon from "@/components/Icon"
import { clsx } from "clsx"
import { useState } from "react"
import { Pressable } from "react-native"
import ContextMenu, { ContextMenuAction } from "react-native-context-menu-view"

export default function HeaderContextMenu({
  icon,
  onPress,
  actions,
}: {
  icon: string
  onPress: (index: number) => void
  actions: ContextMenuAction[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <ContextMenu
      onPress={({ nativeEvent: { index } }) => {
        setOpen(false)
        onPress(index)
      }}
      onCancel={() => setOpen(false)}
      dropdownMenuMode={true}
      actions={actions}
    >
      <Pressable
        onPress={() => setOpen(true)}
        className={clsx(
          "group p-1.5 w-9 items-center justify-center aspect-square rounded-full active:bg-[--primary]",
          {
            "bg-[--card]": !open,
            "bg-[--primary]": open,
          },
        )}
      >
        <Icon.MaterialCommunity
          name={icon as any}
          className={clsx("group-active:text-[--background]", {
            "text-[--text]": !open,
            "text-[--background]": open,
          })}
          size={20}
        />
      </Pressable>
    </ContextMenu>
  )
}
