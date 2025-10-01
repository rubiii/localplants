import useTheme from "@/hooks/useTheme"
import { hexToRgb, luminance } from "@/lib/colorUtils"
import PoweredByPlantNetDark from "@assets/plantnet/powered-by-plantnet-dark-nobg.svg"
import PoweredByPlantNetLight from "@assets/plantnet/powered-by-plantnet-light-nobg.svg"

export default function PlantNetLogo() {
  const { colors } = useTheme()
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
