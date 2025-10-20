import { clsx } from "clsx"
import { type ButtonHTMLAttributes } from "react"

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "px-3 py-2 bg-button rounded-lg border border-border hover:cursor-pointer",
        className
      )}
    />
  )
}
