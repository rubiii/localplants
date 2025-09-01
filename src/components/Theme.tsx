import useTheme from "@/hooks/useTheme"
import { View, type ViewProps } from "react-native"

export default function Theme({ style, ...props }: ViewProps) {
  const { nativewindStyles } = useTheme()

  return <View style={[{ flex: 1 }, nativewindStyles, style]} {...props} />
}
