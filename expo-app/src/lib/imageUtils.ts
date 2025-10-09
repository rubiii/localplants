export function scaleToFit(
  originalDimensions: [number, number],
  maxSize: number,
): { width: number; height: number } {
  const width = originalDimensions[0]
  const height = originalDimensions[1]

  if (width <= maxSize && height <= maxSize) {
    return { width, height }
  }

  const aspectRatio = width / height

  if (width > height) {
    return {
      width: maxSize,
      height: Math.round(maxSize / aspectRatio),
    }
  } else {
    return {
      width: Math.round(maxSize * aspectRatio),
      height: maxSize,
    }
  }
}
