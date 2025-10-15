import { clsx } from "clsx"
import { Keyboard, Pressable } from "react-native"
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller"

export default function ScrollableScreenContainer({
  children,
  className,
  contentInsetAdjustmentBehavior = "automatic",
  ...props
}: KeyboardAwareScrollViewProps & { className?: string }) {
  return (
    <KeyboardAwareScrollView
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      className="bg-[--background]"
      bottomOffset={64}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      <Pressable
        className={clsx("flex-1", className)}
        onPress={() => Keyboard.dismiss()}
      >
        {children}
      </Pressable>
    </KeyboardAwareScrollView>
  )
}
