import DismissKeyboard from "@/components/DismissKeyboard"
import { useHeaderHeight } from "@react-navigation/elements"
import { clsx } from "clsx"
import { ReactNode } from "react"
import { ScrollView } from "react-native"

export default function ScrollableScreenContainer({
  children,
  className,
  noPadding = false,
}: {
  children: ReactNode
  className?: string
  noPadding?: boolean
}) {
  const headerHeight = useHeaderHeight()
  const paddingTop = noPadding ? 0 : headerHeight

  return (
    <ScrollView className="bg-[--background]" style={{ paddingTop }}>
      <DismissKeyboard className={clsx("flex-1", className)}>
        {children}
      </DismissKeyboard>
    </ScrollView>
  )
}
