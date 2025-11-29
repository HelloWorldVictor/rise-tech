import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { registerUser, createSession } from '@/lib/auth'

interface RegisterInput {
  name: string
  email: string
  password: string
  role?: 'learner' | 'mentor'
}

// Register server function
export const register = createServerFn({ method: 'POST' })
  .inputValidator((input: RegisterInput) => {
    // Validate required fields
    if (!input.name || !input.email || !input.password) {
      throw new Error('Name, email, and password are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (input.password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    // Validate role if provided
    if (input.role && !['learner', 'mentor'].includes(input.role)) {
      throw new Error('Role must be learner or mentor')
    }

    return input
  })
  .handler(async ({ data }) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'learner',
      })

      // Create session for the new user
      const sessionToken = await createSession(user.id)

      // Set the session cookie directly in the response
      setCookie('sessionToken', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('Registration failed')
    }
  })
