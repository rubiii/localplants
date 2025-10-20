import type { HTMLProps } from "react"

type Props = Omit<HTMLProps<HTMLInputElement>, "onChange"> & {
  onChange?: (value: string) => unknown
}
export default function TextField({
  value,
  onChange
}: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => {
        if (!onChange) return
        onChange(event.target.value)
      }}
      className="px-3 py-2 bg-button rounded-lg border border-border"
    />
  )
}
