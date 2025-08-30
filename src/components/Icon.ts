import FeatherIcon from "@expo/vector-icons/Feather"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { cssInterop } from "nativewind"

cssInterop(FeatherIcon, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

cssInterop(MaterialIcons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

cssInterop(MaterialCommunityIcons, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
})

const Icon = {
  Feather: FeatherIcon,
  Material: MaterialIcons,
  MaterialCommunity: MaterialCommunityIcons,
}

export default Icon
