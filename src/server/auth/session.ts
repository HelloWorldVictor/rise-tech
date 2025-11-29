import { createServerFn } from '@tanstack/react-start'
import { getUserFromCookie } from '@/lib/serverHelpers'

// Get current session/user server function
export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getUserFromCookie()

    if (!user) {
      return {
        authenticated: false,
        user: null,
      }
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  },
)
