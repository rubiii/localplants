import useTheme from "@/hooks/useTheme"
import AcceptSharedPlantScreen, {
  routeOptions as acceptSharedPlantRouteOptions,
} from "@/screens/AcceptSharedPlantScreeen"
import AccountScreen, {
  routeOptions as accountRouteOptions,
} from "@/screens/AccountScreen"
import CollectionScreen, {
  routeOptions as collectionRouteOptions,
} from "@/screens/CollectionScreen"
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
import { Platform, Text } from "react-native"
import EditCollectionScreen, {
  routeOptions as editCollectionRouteOptions,
} from "./screens/Collection/EditCollectionScreen"
import SharePlantScreen, {
  routeOptions as sharePlantRouteOptions,
} from "./screens/Plant/SharePlantScreen"

export type RootStackParamList = {
  Welcome: undefined
  AcceptSharedPlant: {
    valueID: string
    inviteSecret: InviteSecret
    sharerID: string
    sharerName: string
  }
  Plants: undefined
  Collection: {
    title: string
    collectionId: string
    readOnly: boolean
  }
  EditCollection: {
    collectionName: string
    collectionId: string
  }
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
  const { resolvedTheme, colors } = useTheme()

  const rootStackOptions: NativeStackNavigationOptions = {
    headerTintColor: colors.foreground,
    headerTransparent: true,
    headerBlurEffect: resolvedTheme === "light" ? "light" : "dark",
  }
  const modalScreenOptions: NativeStackNavigationOptions = {
    presentation: "modal",
    headerTransparent: Platform.OS === "ios",
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
            name="Collection"
            component={CollectionScreen}
            options={collectionRouteOptions}
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
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={addPlantRouteOptions}
          />
        </Stack.Group>

        {/* Collection modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="EditCollection"
            component={EditCollectionScreen}
            options={editCollectionRouteOptions}
          />
        </Stack.Group>

        {/* Plant modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
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
