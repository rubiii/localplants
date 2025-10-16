import { AnimatePresence, motion } from "framer-motion"
import { type ReactNode } from "react"

type ImageGridItem = {
  id: string
  content: ReactNode
}

export default function ImageGrid({ children }: { children: ReactNode }) {
  return (
    <motion.ol
      layout
      initial={false}
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
    >
      <AnimatePresence>{children}</AnimatePresence>
    </motion.ol>
  )
}

const ImageGridItem = ({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) => {
  return (
    <motion.li
      key={id}
      layout
      // initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {children}
    </motion.li>
  )
}

export { ImageGridItem }
