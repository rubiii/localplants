import theme from "@/theme"
import { useColorScheme } from "nativewind"
import { View, type ViewProps } from "react-native"

export default function Theme({ style, ...props }: ViewProps) {
  const { colorScheme } = useColorScheme()
  const themeStyle = theme[colorScheme ?? "dark"]

  return <View style={[{ flex: 1 }, themeStyle, style]} {...props} />
}
