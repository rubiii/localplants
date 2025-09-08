import MaterialCommunity from "@expo/vector-icons/MaterialCommunityIcons"
import Material from "@expo/vector-icons/MaterialIcons"
import { cssInterop } from "nativewind"

cssInterop(Material, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

cssInterop(MaterialCommunity, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

const Icon = {
  Material: Material,
  MaterialCommunity: MaterialCommunity,
}

export default Icon
export { Material, MaterialCommunity }
