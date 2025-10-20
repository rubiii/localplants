import { flushSync } from "react-dom"
import { calculateMaxRadius } from "./themeHelpers"

// Checks if view transitions are supported and should be used.
export const shouldUseViewTransition = (): boolean => {
  // Check if View Transition API is supported
  if (!("startViewTransition" in document)) {
    return false
  }

  // Respect user's motion preferences
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false
  }

  return true
}

interface ViewTransitionOptions {
  element: HTMLElement
  updateFn: () => void
  duration: number // milliseconds
  easing: string
  pseudoElement: string
}

// Performs a circular reveal animation from a given element's center point
// Uses the View Transition API to create a smooth, animated transition.
export const animateFromElement = async (
  options: ViewTransitionOptions
): Promise<void> => {
  const { element, updateFn, duration, easing, pseudoElement } = options

  if (!shouldUseViewTransition()) {
    updateFn()
    return
  }

  try {
    // Get the center point of the element.
    const { top, left, width, height } = element.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2

    // Calculate the maximum radius to cover the entire viewport.
    const maxRadius = calculateMaxRadius(x, y)

    // Start the view transition.
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        updateFn()
      })
    })
    await transition.ready

    // Animate the circular reveal.
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${String(x)}px ${String(y)}px)`,
          `circle(${String(maxRadius)}px at ${String(x)}px ${String(y)}px)`,
        ],
      },
      {
        duration,
        easing,
        pseudoElement,
      }
    )
  } catch (error) {
    // If animation fails for any reason, still apply the update.
    console.warn("View transition failed, applying update without animation:", error)
    updateFn()
  }
}
