import { createContext, useContext, useState } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  userEmail: string | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'pbm-demo-auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY)
  )

  const login = (email: string) => {
    localStorage.setItem(STORAGE_KEY, email)
    setUserEmail(email)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUserEmail(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!userEmail, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
