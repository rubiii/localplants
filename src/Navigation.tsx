import useTheme from "@/hooks/useTheme"
import AcceptSharedPlantScreen, {
  routeOptions as acceptSharedPlantRouteOptions,
} from "@/screens/AcceptSharedPlantScreen"
import AccountScreen, {
  routeOptions as accountRouteOptions,
} from "@/screens/Account/AccountScreen"
import CustomThemeScreen, {
  routeOptions as customThemeRouteOptions,
} from "@/screens/Account/CustomThemeScreen"
import CollectionScreen, {
  routeOptions as collectionRouteOptions,
} from "@/screens/Collection/CollectionScreen"
import EditCollectionScreen, {
  routeOptions as editCollectionRouteOptions,
} from "@/screens/Collection/EditCollectionScreen"
import AddPlantImageScreen, {
  routeOptions as addPlantImageRouteOptions,
} from "@/screens/Plant/AddPlantImageScreen"
import PlantImageModal, {
  routeOptions as plantImageModalRouteOptions,
} from "@/screens/Plant/PlantImageModal"
import PlantScreen, {
  routeOptions as plantRouteOptions,
} from "@/screens/Plant/PlantScreen"
import RemovePlantScreen, {
  routeOptions as removePlantRouteOptions,
} from "@/screens/Plant/RemovePlantScreen"
import SharePlantScreen, {
  routeOptions as sharePlantRouteOptions,
} from "@/screens/Plant/SharePlantScreen"
import AddPlantScreen, {
  routeOptions as addPlantRouteOptions,
} from "@/screens/Plants/AddPlantScreen"
import PlantsScreen, {
  routeOptions as plantsRouteOptions,
} from "@/screens/Plants/PlantsScreen"
import WelcomeScreen, {
  routeOptions as welcomeRouteOptions,
} from "@/screens/WelcomeScreen"
import { NavigationContainer } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as Linking from "expo-linking"
import { InviteSecret } from "jazz-tools"
import { Platform } from "react-native"
import { hexToRgb, luminance } from "./lib/colorUtils"
import RemoveCollectionScreen, {
  routeOptions as removeCollectionRouteOptions,
} from "./screens/Collection/RemoveCollectionScreen"

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
  RemoveCollection: {
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
  CustomTheme: { customThemeName: string } | undefined
  PlantImageModal: { plantImageId: string }
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
    headerTintColor: colors.text,
    headerTransparent: true,
    headerBlurEffect:
      luminance(hexToRgb(colors.background)) > 0.5 ? "light" : "dark",
  }
  const modalScreenOptions: NativeStackNavigationOptions = {
    presentation: "modal",
    headerTransparent: Platform.OS === "ios",
  }

  return (
    <NavigationContainer linking={{ prefixes: [prefix] }}>
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
        </Stack.Group>

        {/* Account modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="Account"
            component={AccountScreen}
            options={accountRouteOptions}
          />
          <Stack.Screen
            name="CustomTheme"
            component={CustomThemeScreen}
            options={customThemeRouteOptions}
          />
        </Stack.Group>

        {/* Plants modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="AddPlant"
            component={AddPlantScreen}
            options={addPlantRouteOptions}
          />
        </Stack.Group>

        {/* Plant modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="AddPlantImage"
            component={AddPlantImageScreen}
            options={addPlantImageRouteOptions}
          />
          <Stack.Screen
            name="PlantImageModal"
            component={PlantImageModal}
            options={plantImageModalRouteOptions}
          />
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
        </Stack.Group>

        {/* Collection modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="EditCollection"
            component={EditCollectionScreen}
            options={editCollectionRouteOptions}
          />
          <Stack.Screen
            name="RemoveCollection"
            component={RemoveCollectionScreen}
            options={removeCollectionRouteOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
