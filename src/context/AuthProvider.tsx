import React, { createContext, useContext, useState, useEffect } from "react"

export interface UserInfo {
  userId: number
  username: string
}

interface MeResponse<T> {
  success: boolean,
  message: string,
  field?: string,
  data?: T
}

interface AuthContextType {
  user: UserInfo | undefined
  isAuthenticated: boolean
  loading: boolean
  login: (user: UserInfo) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | undefined>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const rawResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // send cookies
      })

      if (!rawResponse.ok) throw new Error("Not authenticated")

      const response: MeResponse<UserInfo> = await rawResponse.json()
      setUser(response.data)
      setIsAuthenticated(true)

    } catch(error) {
      setUser(undefined)
      setIsAuthenticated(false)
      console.error(error);

    } finally {
      setLoading(false)
    }
  }

  const login = (user: UserInfo) => {
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(undefined)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}