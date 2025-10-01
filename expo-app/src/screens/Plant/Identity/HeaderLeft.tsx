import HeaderTextButton from "@/components/HeaderTextButton"

export default function HeaderLeft({
  text,
  onPress,
}: {
  text: string
  onPress: () => void
}) {
  return <HeaderTextButton text={text} onPress={onPress} />
}
