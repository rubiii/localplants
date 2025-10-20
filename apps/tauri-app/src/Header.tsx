import {
  CircleUserRound as AccountIcon,
  CircleArrowLeft as BackIcon,
  Palette as ThemeIcon,
} from "lucide-react"
import { useState } from "react"
import { Link } from "wouter"
import AccountModal from "./pages/AccountModal"
import ThemeModal from "./pages/ThemeModal"

export interface Props {
  title?: string | undefined;
  backTo?: string;
}

export default function Header({ title, backTo }: Props) {
  return (
    <div className="h-12 px-12 fixed top-0 left-0 right-0 z-100 flex items-center bg-background border-b border-border">
      <div className="flex flex-1">
        <div className="flex-1">
          {backTo ? (
            <div className="flex gap-2 items-center">
              <Link to={backTo} className="hover:text-primary">
                <BackIcon size={20} />
              </Link>

              <h1 className="text-title font-bold cursor-default">{title}</h1>
            </div>
          ) : (
            <h1 className="text-title font-bold cursor-default">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Theme />
          <Account />
        </div>
      </div>
    </div>
  )
}

function Theme() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button onClick={() => { setShowModal(true) }} className="p-1 cursor-pointer hover:text-primary">
        <ThemeIcon size={20} />
      </button>

      <ThemeModal isOpen={showModal} setIsOpen={setShowModal} />
    </>
  )
}

function Account() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button onClick={() => { setShowModal(true) }} className="p-1 cursor-pointer hover:text-primary">
        <AccountIcon size={20} />
      </button>

      <AccountModal isOpen={showModal} setIsOpen={setShowModal} />
    </>
  )
}
