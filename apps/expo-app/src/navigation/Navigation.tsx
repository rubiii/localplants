import useTheme from "@/hooks/useTheme"
import { hexToRgb, luminance } from "@/lib/colorUtils"
import AcceptSharedPlantScreen, {
  routeOptions as acceptSharedPlantRouteOptions,
} from "@/screens/AcceptSharedPlantScreen"
import AccountScreen, {
  routeOptions as accountRouteOptions,
} from "@/screens/Account/AccountScreen"
import AuthScreen, {
  routeOptions as authRouteOptions,
} from "@/screens/Account/AuthScreen"
import CustomThemeScreen, {
  routeOptions as customThemeRouteOptions,
} from "@/screens/Account/CustomThemeScreen"
import LoginScreen, {
  routeOptions as loginRouteOptions,
} from "@/screens/Account/LoginScreen"
import AddCollectionScreen, {
  routeOptions as addCollectionRouteOptions,
} from "@/screens/Collection/AddCollectionScreen"
import CollectionScreen, {
  routeOptions as collectionRouteOptions,
} from "@/screens/Collection/CollectionScreen"
import EditCollectionScreen, {
  routeOptions as editCollectionRouteOptions,
} from "@/screens/Collection/EditCollectionScreen"
import HomeScreen, {
  routeOptions as homeRouteOptions,
} from "@/screens/HomeScreen"
import PermissionsScreen, {
  routeOptions as permissionsRouteOptions,
} from "@/screens/PermissionsScreen"
import AddPlantImageScreen, {
  routeOptions as addPlantImageRouteOptions,
} from "@/screens/Plant/AddPlantImageScreen"
import AddPlantScreen, {
  routeOptions as addPlantRouteOptions,
} from "@/screens/Plant/AddPlantScreen"
import EditPlantScreen, {
  routeOptions as editPlantRouteOptions,
} from "@/screens/Plant/EditPlantScreen"
import IdentityScreen, {
  routeOptions as identityRouteOptions,
} from "@/screens/Plant/Identity/IndentityScreen"
import PlantImageModal, {
  routeOptions as plantImageModalRouteOptions,
} from "@/screens/Plant/PlantImageModal"
import PlantScreen, {
  routeOptions as plantRouteOptions,
} from "@/screens/Plant/PlantScreen"
import SharePlantScreen, {
  routeOptions as sharePlantRouteOptions,
} from "@/screens/Plant/SharePlantScreen"
import WelcomeScreen, {
  routeOptions as welcomeRouteOptions,
} from "@/screens/WelcomeScreen"
import { NavigationContainer } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import * as Linking from "expo-linking"
import Stack from "./Stack"

const prefix = Linking.createURL("/")

export default function Navigation({ skipWelcome }: { skipWelcome: boolean }) {
  const { colors } = useTheme()

  const rootStackOptions: NativeStackNavigationOptions = {
    headerTintColor: colors.text,
    headerTransparent: true,
    // headerStyle: { backgroundColor: "transparent" },
    headerBlurEffect:
      luminance(hexToRgb(colors.background)) > 0.5 ? "light" : "dark",
  }
  const modalScreenOptions: NativeStackNavigationOptions = {
    presentation: "modal",
    headerStyle: { backgroundColor: "transparent" },
  }

  return (
    <NavigationContainer linking={{ prefixes: [prefix] }}>
      <Stack.Navigator screenOptions={rootStackOptions}>
        {!skipWelcome ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={welcomeRouteOptions}
            />
            <Stack.Screen
              name="Permissions"
              component={PermissionsScreen}
              options={permissionsRouteOptions}
            />
          </>
        ) : null}

        {/* Home stack */}
        <Stack.Group>
          <Stack.Screen
            name="Plants"
            component={HomeScreen}
            options={homeRouteOptions}
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
            name="Auth"
            component={AuthScreen}
            options={authRouteOptions}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={loginRouteOptions}
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
          <Stack.Screen
            name="EditPlant"
            component={EditPlantScreen}
            options={editPlantRouteOptions}
          />
          <Stack.Screen
            name="Identity"
            component={IdentityScreen}
            options={identityRouteOptions}
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
        </Stack.Group>

        {/* Collection modals */}
        <Stack.Group screenOptions={modalScreenOptions}>
          <Stack.Screen
            name="AddCollection"
            component={AddCollectionScreen}
            options={addCollectionRouteOptions}
          />
          <Stack.Screen
            name="EditCollection"
            component={EditCollectionScreen}
            options={editCollectionRouteOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
