import useNavigation from "@/hooks/useNavigation"
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { SafeAreaView } from "react-native"

export const routeOptions = (): NativeStackNavigationOptions => ({
  title: "Custom Theme",
  headerLargeTitle: true,
})

export default function CustomTheme() {
  const { route } = useNavigation<"CustomTheme">()
  const themeId = route.params.themeId

  // const navigation = useNavigation()
  // const listRef = useRef<FlatList>(null)

  // const plant = useCoState(Plant, plantId, {
  //   resolve: {
  //     primaryImage: { image: true },
  //     images: { $each: { image: true } },
  //   },
  // })

  // useEffect(() => {
  //   if (!plant) return

  //   // update screen title when plant name changes
  //   navigation.setOptions({ title: plant.name })

  //   // scroll list to top when an image was added
  //   // TODO: change to scrollToIndex when images get sorted by date
  //   listRef.current?.scrollToOffset({ offset: 0 })
  // }, [plant, navigation])

  return (
    <SafeAreaView className="flex-1 flex-col bg-[--background]"></SafeAreaView>
  )
}
