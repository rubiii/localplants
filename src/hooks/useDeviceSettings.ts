import AsyncStorage from "@react-native-async-storage/async-storage"

export const settings = {
  hasSeenWelcome: "has-seen-welcome",
} as const

type ValueOf<T> = T[keyof T]
type Setting = ValueOf<typeof settings>

const hasValue = async (key: Setting) =>
  (await AsyncStorage.getItem(key)) === "true"

const setValue = (key: Setting) => AsyncStorage.setItem(key, "true")

const resetAll = () => AsyncStorage.multiRemove(Object.values(settings))

export default function useDeviceSettings() {
  return {
    resetAll,
    hasValue,
    setValue,
  }
}
