import Icon from "@/components/Icon"
import Theme from "@/components/Theme"
import useAccount from "@/hooks/useAccount"
import useTheme from "@/hooks/useTheme"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Pressable, SafeAreaView, Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Your account",
  headerLargeTitle: true,
  headerRight: () => <HeaderRight />,
}

export function HeaderRight() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Theme style={{ flex: 0 }} className="flex-row">
      <Pressable className="group p-2 -mr-2" onPress={toggleTheme}>
        <Icon.Material
          name={theme === "light" ? "dark-mode" : "light-mode"}
          className="text-[--foreground] group-active:text-[--text-primary]"
          size={24}
        />
      </Pressable>
    </Theme>
  )
}
export default function Account() {
  const { isGuest, isAnonymous, isAuthenticated } = useAccount()

  return (
    <SafeAreaView className="flex-1 bg-[--background]">
      <View className="flex-1 pt-4 pb-12 px-5">
        <View className="flex-1">
          <Text className="text-[--foregroundSecondary]">
            State: {isGuest && "Guest Mode"}
            {isAnonymous && "Anonymous Account"}
            {isAuthenticated && "Authenticated"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
