"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiLogin, apiRegister, type UserCredentials, type UserRegistrationData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
  updated_at?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: UserCredentials) => Promise<void>
  register: (data: UserRegistrationData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: UserCredentials) => {
    setIsLoading(true)
    try {
      const response = await apiLogin(credentials)
      localStorage.setItem("authToken", response.access_token)
      setToken(response.access_token)

      // Обычно информация о пользователе получается отдельным запросом /users/me или возвращается при логине
      // Для примера, создадим фейкового пользователя на основе email
      // В реальном приложении здесь должен быть запрос на получение данных пользователя
      const tempUser: User = {
        id: Date.now(), // Placeholder
        email: credentials.username,
        username: credentials.username.split("@")[0], // Placeholder
        is_active: true,
        created_at: new Date().toISOString(),
      }
      localStorage.setItem("authUser", JSON.stringify(tempUser))
      setUser(tempUser)

      toast({ title: "Успешный вход", description: "Добро пожаловать!" })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login failed:", error)
      toast({
        title: "Ошибка входа",
        description: error.message || "Не удалось войти. Проверьте данные.",
        variant: "destructive",
      })
      setUser(null)
      setToken(null)
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: UserRegistrationData) => {
    setIsLoading(true)
    try {
      const registeredUser = await apiRegister(data)
      setUser(registeredUser)
      toast({ title: "Регистрация успешна", description: "Теперь вы можете войти." })
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Registration failed:", error)
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрироваться.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    router.push("/auth/login")
    toast({ title: "Вы вышли из системы" })
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
