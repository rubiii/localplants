// Relative luminance coefficients for sRGB color space (ITU-R BT.709).
// These weights reflect human perception sensitivity to different colors.
const RED = 0.2126
const GREEN = 0.7152
const BLUE = 0.0722

// Standard gamma correction value for sRGB color space.
const GAMMA = 2.4

type RgbValueType = { r: number; g: number; b: number }

function transformColorValue(v: number): number {
  v /= 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA)
}

export function luminance({ r, g, b }: RgbValueType) {
  return transformColorValue(r) * RED +
    transformColorValue(g) * GREEN +
    transformColorValue(b) * BLUE
}

export function contrast(rgb1: RgbValueType, rgb2: RgbValueType) {
  const lum1 = luminance(rgb1)
  const lum2 = luminance(rgb2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

export function rgbToHex({ r, g, b }: RgbValueType) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

export function hexToRgb(hex: string): RgbValueType {
  const [rHex, gHex, bHex] = parseHexGroups(hex)
  return {
    r: parseInt(rHex, 16),
    g: parseInt(gHex, 16),
    b: parseInt(bHex, 16),
  }
}

function parseHexGroups(hex: string): [string, string, string] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result?.[1] || !result?.[2] || !result?.[3]) {
    throw new Error(`Failed to parse hex string ${hex}`)
  }
  return [result[1], result[2], result[3]]
}
