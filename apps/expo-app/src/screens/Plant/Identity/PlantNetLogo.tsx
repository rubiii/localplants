import { hexToRgb, luminance } from "@/lib/colorUtils"
import { useThemeContext } from "@/lib/theme/ThemeProvider"
import PoweredByPlantNetDark from "@assets/plantnet/powered-by-plantnet-dark-nobg.svg"
import PoweredByPlantNetLight from "@assets/plantnet/powered-by-plantnet-light-nobg.svg"

export default function PlantNetLogo() {
  const { colors } = useThemeContext()
  const width = 160
  const height = 38

  if (luminance(hexToRgb(colors.background)) > 0.5) {
    return (
      <PoweredByPlantNetLight
        width={width}
        height={height}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
    )
  }

  return (
    <PoweredByPlantNetDark
      width={width}
      height={height}
      style={{ marginLeft: "auto", marginRight: "auto" }}
    />
  )
}
