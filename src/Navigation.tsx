import useTheme from "@/hooks/useTheme"
import AcceptPlantInvite, {
  routeOptions as acceptPlantInviteRouteOptions,
} from "@/screens/AcceptPlantInvite"
import Account, { routeOptions as accountRouteOptions } from "@/screens/Account"
import PlantDetails, {
  routeOptions as plantDetailRouteOptions,
} from "@/screens/PlantDetails"
import AddPlantImage, {
  routeOptions as addPlantImageRouteOptions,
} from "@/screens/PlantDetails/AddPlantImage"
import RemovePlant, {
  routeOptions as removePlantRouteOptions,
} from "@/screens/PlantDetails/RemovePlant"
import Plants, { routeOptions as plantsRouteOptions } from "@/screens/Plants"
import AddPlant, {
  routeOptions as addPlantRouteOptions,
} from "@/screens/Plants/AddPlant"
import Welcome, { routeOptions as welcomeRouteOptions } from "@/screens/Welcome"
import { NavigationContainer } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Linking from "expo-linking"
import { InviteSecret } from "jazz-tools"
import { Text } from "react-native"
import SharePlant, {
  routeOptions as sharePlantRouteOptions,
} from "./screens/PlantDetails/SharePlant"

export type RootStackParamList = {
  Welcome: undefined
  AcceptPlantInvite: {
    value_id: string
    invite_secret: InviteSecret
    shared_by_id: string
    shared_by_name: string
  }
  Plants: undefined
  PlantDetails: {
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
            component={Welcome}
            options={welcomeRouteOptions}
          />
        ) : null}

        {/* Home stack */}
        <Stack.Group>
          <Stack.Screen
            name="Plants"
            component={Plants}
            options={plantsRouteOptions}
          />
          <Stack.Screen
            name="PlantDetails"
            component={PlantDetails}
            options={plantDetailRouteOptions}
          />

          <Stack.Screen
            name="AcceptPlantInvite"
            component={AcceptPlantInvite}
            options={acceptPlantInviteRouteOptions}
          />

          <Stack.Group>
            <Stack.Screen
              name="Account"
              component={Account}
              options={accountRouteOptions}
            />
          </Stack.Group>
        </Stack.Group>

        {/* Plants modals */}
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="AddPlant"
            component={AddPlant}
            options={addPlantRouteOptions}
          />
        </Stack.Group>

        {/* PlantDetails modals */}
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="SharePlant"
            component={SharePlant}
            options={sharePlantRouteOptions}
          />
          <Stack.Screen
            name="RemovePlant"
            component={RemovePlant}
            options={removePlantRouteOptions}
          />
          <Stack.Screen
            name="AddPlantImage"
            component={AddPlantImage}
            options={addPlantImageRouteOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
