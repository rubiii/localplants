import {
  useNavigation as useReactNativeNavigation,
  type ParamListBase,
} from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

export default function useNavigation() {
  return useReactNativeNavigation<NativeStackNavigationProp<ParamListBase>>()
}
