import DismissKeyboard from "@/components/DismissKeyboard"
import { clsx } from "clsx"
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller"

export default function ScrollableScreenContainer({
  children,
  className,
  contentInsetAdjustmentBehavior = "automatic",
  ...props
}: KeyboardAwareScrollViewProps) {
  return (
    <KeyboardAwareScrollView
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      className="bg-[--background]"
      bottomOffset={64}
      {...props}
    >
      <DismissKeyboard className={clsx("flex-1", className)}>
        {children}
      </DismissKeyboard>
    </KeyboardAwareScrollView>
  )
}
