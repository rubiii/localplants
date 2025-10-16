import Header, { type Props as HeaderProps } from "@/Header";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  className?: string
  children: ReactNode
}

export default function AnimatedRoute({
  className,
  children,
  ...headerProps
}: Props & HeaderProps) {
  return (
    <div className="text-copy">
      <Header {...headerProps} />

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: 3 }}
        exit={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={clsx("pt-20 pb-6 px-12", className)}
      >
        {children}
      </motion.div>
    </div>
  )
}
