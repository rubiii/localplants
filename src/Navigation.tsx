import useDeviceSettings from "@/hooks/useDeviceSettings"
import useTheme from "@/hooks/useTheme"
import Account, { routeOptions as accountRouteOptions } from "@/screens/Account"
import PlantDetails, {
  routeOptions as plantDetailRouteOptions,
} from "@/screens/PlantDetails"
import AddPlantImage, {
  routeOptions as addPlantImageRouteOptions,
} from "@/screens/PlantDetails/AddPlantImage"
import EditPlant, {
  routeOptions as editPlantRouteOptions,
} from "@/screens/PlantDetails/EditPlant"
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
import { useEffect, useState } from "react"

const Stack = createNativeStackNavigator()

export default function Navigation() {
  const { colors } = useTheme()
  const settings = useDeviceSettings()
  const [initialRouteName, setInitialRouteName] = useState<string>()

  const rootStackOptions: NativeStackNavigationOptions = {
    headerTintColor: colors.foreground,
    headerTransparent: true,
    headerBlurEffect: "regular",
  }

  useEffect(() => {
    settings
      .hasValue("has-seen-welcome")
      .then((value) => setInitialRouteName(value ? "Plants" : "Welcome"))
  }, [settings])

  if (!initialRouteName) return

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={rootStackOptions}
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={welcomeRouteOptions}
        />

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
            name="Account"
            component={Account}
            options={accountRouteOptions}
          />
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
            name="EditPlant"
            component={EditPlant}
            options={editPlantRouteOptions}
          />
          <Stack.Screen
            name="AddPlantImage"
            component={AddPlantImage}
            options={addPlantImageRouteOptions}
          />
          <Stack.Screen
            name="RemovePlant"
            component={RemovePlant}
            options={removePlantRouteOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
