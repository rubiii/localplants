import { useEffect, useState } from "react"

export function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

// Returns the current system dark mode preference.
export function useSystemTheme(): boolean {
  const [prefersDark, setPrefersDark] = useState(getSystemPrefersDark)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => { mediaQuery.removeEventListener("change", handleChange) }
  }, [])

  return prefersDark
}
