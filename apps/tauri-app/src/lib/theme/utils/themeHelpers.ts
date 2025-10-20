const BASE_STYLE_ID = "theme-switch-base-style"
const HIGH_RESOLUTION_THRESHOLD = { width: 3000, height: 2000 }

// Calculates the maximum radius needed for a circular animation
// to cover the entire viewport from a given point.
export const calculateMaxRadius = (x: number, y: number): number => {
  const topLeft = Math.hypot(x, y)
  const topRight = Math.hypot(window.innerWidth - x, y)
  const bottomLeft = Math.hypot(x, window.innerHeight - y)
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y)

  return Math.max(topLeft, topRight, bottomLeft, bottomRight)
}

// Injects base CSS styles for view transitions into the document head
export const injectBaseStyles = (): void => {
  if (document.getElementById(BASE_STYLE_ID)) return

  const style = document.createElement("style")
  style.id = BASE_STYLE_ID
  const highRes = isHighResolution()

  style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
      ${highRes ? 'transform: translateZ(0);' : ''}
    }

    ${highRes ? `
      ::view-transition-group(root),
      ::view-transition-image-pair(root),
      ::view-transition-old(root),
      ::view-transition-new(root) {
        backface-visibility: hidden;
        perspective: 1000px;
        transform: translate3d(0, 0, 0);
      }
    ` : ''}
  `

  document.head.appendChild(style)
}

const isHighResolution = (): boolean => {
  return (
    window.innerWidth >= HIGH_RESOLUTION_THRESHOLD.width ||
    window.innerHeight >= HIGH_RESOLUTION_THRESHOLD.height
  )
}
