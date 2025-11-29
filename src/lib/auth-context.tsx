import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from '@tanstack/react-router'
import { getSession, login, logout, register } from '@/server/auth'
import { toast } from 'sonner'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'learner' | 'mentor'
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshSession = useCallback(async () => {
    try {
      const session = await getSession()
      if (session.authenticated && session.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ data: { email, password } })
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true, user: result.user }
      }
      return { success: false, error: 'Login failed' }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const handleRegister = async (data: RegisterData) => {
    try {
      const result = await register({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || 'learner',
        },
      })
      if (result.success && result.user) {
        setUser(result.user)
        return { success: true, user: result.user }
      }
      return { success: false, error: 'Registration failed' }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.navigate({ to: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protecting routes
export function useRequireAuth(requiredRole?: string) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: '/auth/login' })
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'admin') {
        router.navigate({ to: '/admin' })
      } else if (user?.role === 'mentor') {
        router.navigate({ to: '/mentor/dashboard' })
      } else {
        router.navigate({ to: '/dashboard' })
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router])

  return { user, isLoading, isAuthenticated }
}
