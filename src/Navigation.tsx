import useTheme from "@/hooks/useTheme"
import AcceptSharedPlantScreen, {
  routeOptions as acceptSharedPlantRouteOptions,
} from "@/screens/AcceptSharedPlantScreeen"
import AccountScreen, {
  routeOptions as accountRouteOptions,
} from "@/screens/AccountScreen"
import AddPlantImageScreen, {
  routeOptions as addPlantImageRouteOptions,
} from "@/screens/Plant/AddPlantImageScreen"
import RemovePlantScreen, {
  routeOptions as removePlantRouteOptions,
} from "@/screens/Plant/RemovePlantScreen"
import AddPlantScreen, {
  routeOptions as addPlantRouteOptions,
} from "@/screens/Plants/AddPlantScreen"
import PlantScreen, {
  routeOptions as plantRouteOptions,
} from "@/screens/PlantScreen"
import PlantsScreen, {
  routeOptions as plantsRouteOptions,
} from "@/screens/PlantsScreen"
import WelcomeScreen, {
  routeOptions as welcomeRouteOptions,
} from "@/screens/WelcomeScreen"
import { NavigationContainer } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Linking from "expo-linking"
import { InviteSecret } from "jazz-tools"
import { Text } from "react-native"
import SharePlantScreen, {
  routeOptions as sharePlantRouteOptions,
} from "./screens/Plant/SharePlantScreen"

export type RootStackParamList = {
  Welcome: undefined
  AcceptSharedPlant: {
    value_id: string
    invite_secret: InviteSecret
    shared_by_id: string
    shared_by_name: string
  }
  Plants: undefined
  Plant: {
    title: string
    plantId: string
    collectionId: string
    readOnly: boolean
  }
  Account: undefined
  AddPlant: { collectionId: string }
  SharePlant: { plantId: string }
  RemovePlant: { plantId: string; collectionId: string }
  AddPlantImage: { plantId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const prefix = Linking.createURL("/")

export default function Navigation({ skipWelcome }: { skipWelcome: boolean }) {
  const { colors } = useTheme()

  const rootStackOptions: NativeStackNavigationOptions = {
    headerTintColor: colors.foreground,
    headerStyle: { backgroundColor: colors.background },
    // headerTransparent: true,
    // headerBlurEffect: "regular",
  }

  return (
    <NavigationContainer
      linking={{ prefixes: [prefix] }}
      fallback={<Text>Loading...</Text>}
    >
      <Stack.Navigator screenOptions={rootStackOptions}>
        {!skipWelcome ? (
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={welcomeRouteOptions}
          />
        ) : null}

        {/* Home stack */}
        <Stack.Group>
          <Stack.Screen
            name="Plants"
            component={PlantsScreen}
            options={plantsRouteOptions}
          />

          <Stack.Screen
            name="Plant"
            component={PlantScreen}
            options={plantRouteOptions}
          />

          <Stack.Screen
            name="AcceptSharedPlant"
            component={AcceptSharedPlantScreen}
            options={acceptSharedPlantRouteOptions}
          />

          <Stack.Group>
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={accountRouteOptions}
            />
          </Stack.Group>
        </Stack.Group>

        {/* Plants modals */}
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={addPlantRouteOptions}
          />
        </Stack.Group>

        {/* Plant modals */}
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="SharePlant"
            component={SharePlantScreen}
            options={sharePlantRouteOptions}
          />
          <Stack.Screen
            name="RemovePlant"
            component={RemovePlantScreen}
            options={removePlantRouteOptions}
          />
          <Stack.Screen
            name="AddPlantImage"
            component={AddPlantImageScreen}
            options={addPlantImageRouteOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
