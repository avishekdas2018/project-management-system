"use client"
import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"
import { usePathname } from "next/navigation"


const pathnameMap = {
  "tasks": {
    title: "My Tasks",
    description: "View and manage your tasks here"
  },

  "projects": {
    title: "My Projects",
    description: "View and manage your projects here and view all the tasks in each project"
  }
}


const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here"
}


export const Navbar = () => {
  const pathname = usePathname()
  const pathnameParts = pathname.split("/")
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap

  const { title, description } = pathnameMap[pathnameKey] || defaultMap
  return (
    <nav className="flex pt-4 px-6 items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar/>
      <UserButton/> 
    </nav>
  )
}