import DismissKeyboard from "@/components/DismissKeyboard"
import { useHeaderHeight } from "@react-navigation/elements"
import { clsx } from "clsx"
import { ReactNode } from "react"
import { View } from "react-native"

export default function ScreenContainer({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const paddingTop = useHeaderHeight()

  return (
    <View className="flex-1 bg-[--background]" style={{ paddingTop }}>
      <DismissKeyboard className={clsx("flex-1", className)}>
        {children}
      </DismissKeyboard>
    </View>
  )
}
