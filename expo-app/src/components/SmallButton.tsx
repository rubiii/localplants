import Text from "@/components/Text"
import { clsx } from "clsx"
import { ReactNode } from "react"
import { Pressable, View } from "react-native"

export default function SmallButton({
  onPress,
  icon,
  active,
  className,
  children,
}: {
  onPress?: () => void
  icon?: ReactNode
  active?: boolean
  className?: string
  children: ReactNode
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
          {children}
        </Text>
      </View>
    </Pressable>
  )
}
