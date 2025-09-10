import Button from "@/components/Button"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import useNavigation from "@/hooks/useNavigation"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Text, View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Local Plants",
}

export default function WelcomeScreen() {
  const { navigation } = useNavigation<"Welcome">()

  const openPermissions = async () => navigation.navigate("Permissions")

  return (
    <ScrollableScreenContainer className="px-4 landscape:pl-20 pt-24 landscape:pt-8 pb-8">
      <Text className="text-6xl font-bold text-[--primary]">Welcome</Text>

      <Text className="mt-2 text-xl text-[--text] leading-snug w-10/12">
        Local Plants is a new kind of software based on Local-first ideals
      </Text>

      <View className="my-12">
        <ListItem text="Works completely offline" />
        <ListItem text="Fully end-to-end encrypted" />
        <ListItem text="Your data stays on this device by default" />
        <ListItem text="Optional sync for backup and sharing" />
      </View>

      <Button title="Continue" size="large" onPress={openPermissions} />
    </ScrollableScreenContainer>
  )
}

function ListItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-center">
      <View className="w-5">
        <Text className="text-2xl text-[--text] leading-7">•</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg text-[--text] leading-snug">{text}</Text>
      </View>
    </View>
  )
}
