import DismissKeyboard from "@/components/DismissKeyboard"
import { useHeaderHeight } from "@react-navigation/elements"
import { clsx } from "clsx"
import { ReactNode } from "react"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

export default function ScrollableScreenContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const headerHeight = useHeaderHeight()

  return (
    <KeyboardAwareScrollView
      className="bg-[--background]"
      style={{ paddingTop: headerHeight }}
      bottomOffset={64}
    >
      <DismissKeyboard className={clsx("flex-1", className)}>
        {children}
      </DismissKeyboard>
    </KeyboardAwareScrollView>
  )
}
