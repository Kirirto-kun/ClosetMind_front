"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Shirt, ShoppingBag, LogOut, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

interface SidebarProps {
  userEmail: string
}

const navItems = [
  { href: "/dashboard", label: "Главная", icon: Home },
  { href: "/dashboard/chat", label: "AI Ассистент", icon: MessageSquare },
  { href: "/dashboard/wardrobe", label: "Мой Гардероб", icon: Shirt },
  { href: "/dashboard/waitlist", label: "Список Желаний", icon: ShoppingBag },
]

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { setTheme } = useTheme()

  const getInitials = (email: string) => {
    if (!email) return "U"
    const parts = email.split("@")[0].split(/[._-]/)
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div className="mb-8 text-center">
          <Link href="/dashboard" className="flex items-center justify-center space-x-2 group">
            <Palette className="h-8 w-8 text-sky-500 group-hover:animate-pulse" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">ClosetMind</h1>
          </Link>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${
                  pathname === item.href
                    ? "bg-sky-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-700"
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-3 mb-4 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Avatar className="h-9 w-9 mr-3 border-2 border-sky-500">
                <AvatarImage src={`https://avatar.vercel.sh/${userEmail}.png?size=40`} alt={userEmail} />
                <AvatarFallback className="bg-sky-500 text-white">{getInitials(userEmail)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                  {userEmail}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Пользователь</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userEmail.split("@")[0]}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>Светлая тема</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Темная тема</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>Системная тема</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-700/20 dark:focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

// Default props for Next.js
Sidebar.defaultProps = {
  userEmail: "user@example.com",
}
