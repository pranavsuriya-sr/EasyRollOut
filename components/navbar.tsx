"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Easy Roll Out
        </Link>
        <div className="space-x-4">
          {["Home", "Students", "Admin"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={cn(
                "hover:text-gray-300 transition-colors",
                pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`) && "text-blue-400",
              )}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

