import HeaderTextButton from "@/components/HeaderTextButton"

export default function HeaderRight({ onSave }: { onSave?: (() => void) | undefined }) {
  return (
    <HeaderTextButton
      text="Save"
      variant="primary"
      onPress={onSave}
      disabled={!onSave}
    />
  )
}
