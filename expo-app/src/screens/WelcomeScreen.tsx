import Button from "@/components/Button"
import ListItem from "@/components/ListItem"
import ScrollableScreenContainer from "@/components/ScrollableScreenContainer"
import Text from "@/components/Text"
import useNavigation from "@/hooks/useNavigation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { View } from "react-native"

export const routeOptions: NativeStackNavigationOptions = {
  title: "Local Plants",
}

export default function WelcomeScreen() {
  const { navigation } = useNavigation<"Welcome">()

  // TODO: Find out why permission screen crashes
  const openPermissions = async () => {
    // navigation.navigate("Permissions")

    await AsyncStorage.setItem("skip-welcome", "true")
    navigation.navigate("Plants")
  }

  return (
    <ScrollableScreenContainer className="px-4 landscape:pl-20 pt-24 landscape:pt-8 pb-8">
      <Text size="6xl" weight={700} color="primary">
        Welcome
      </Text>

      <Text size="xl" className="mt-2 leading-snug w-10/12">
        Local Plants is a new kind of software based on Local-first ideals
      </Text>

      <View className="my-12">
        <ListItem size="lg" text="Works completely offline" />
        <ListItem size="lg" text="Fully end-to-end encrypted" />
        <ListItem size="lg" text="Your data stays on this device by default" />
        <ListItem size="lg" text="Optional sync for backup and sharing" />
      </View>

      <Button title="Continue" size="large" onPress={openPermissions} />
    </ScrollableScreenContainer>
  )
}
