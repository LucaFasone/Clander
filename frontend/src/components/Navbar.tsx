import { Link } from "@tanstack/react-router"
import { CalendarIcon, Mail } from "lucide-react"
import { Button } from "./ui/button"

function Navbar({ children }: { children: React.ReactNode | undefined }) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Button variant='link' className="flex items-center justify-center" onClick={(e) =>{
        e.preventDefault();
        window.location.href = '/';
      }}>
        <CalendarIcon className="h-6 w-6" />
        <span className="sr-only">Clander</span>
        <span>Clander</span>
      </Button>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {children}
      </nav>
    </header>
  )
}

export default Navbar