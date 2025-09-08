import AsyncStorage from "@react-native-async-storage/async-storage"

const settings = ["skip-welcome", "theme"] as const

type Setting = (typeof settings)[number]

const hasValue = async (key: Setting) =>
  (await AsyncStorage.getItem(key)) === "true"

const getValue = async <T>(key: Setting): Promise<T> =>
  (await AsyncStorage.getItem(key)) as T

const setValue = (key: Setting, value?: string) =>
  AsyncStorage.setItem(key, value ?? "true")

const resetAll = () => AsyncStorage.multiRemove(Object.values(settings))

export default function useDeviceSettings() {
  return {
    resetAll,
    hasValue,
    getValue,
    setValue,
  }
}
