import { RootStackParamList } from "@/navigation/Stack"
import {
  RouteProp,
  useNavigation as useReactNativeNavigation,
  useRoute as useReactNativeRoute,
} from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type Keyof<T extends object> = Extract<keyof T, string>

export type { RootStackParamList }

export default function useNavigation<
  R extends keyof RootStackParamList = Keyof<RootStackParamList>,
>() {
  const navigation =
    useReactNativeNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const route = useReactNativeRoute<RouteProp<RootStackParamList, R>>()

  return {
    navigation,
    route,
  }
}
