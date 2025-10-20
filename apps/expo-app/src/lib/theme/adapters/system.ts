import { useEffect, useState } from "react"
import { Appearance } from "react-native"

export function getSystemPrefersDark(): boolean {
  const colorScheme = Appearance.getColorScheme()
  return colorScheme === "dark"
}

export function useSystemTheme(): boolean {
  const [prefersDark, setPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setPrefersDark(colorScheme === "dark")
    })

    return () => { listener.remove() }
  }, [])

  return prefersDark
}
