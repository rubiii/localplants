import useTheme from "@/hooks/useTheme"
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
import { NavigationContainer } from "@react-navigation/native"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()

export default function Navigation() {
  const { colors } = useTheme()

  const rootStackOptions: NativeStackNavigationOptions = {
    headerTintColor: colors.foreground,
    headerTransparent: true,
    headerBlurEffect: "regular",
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={rootStackOptions}>
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
