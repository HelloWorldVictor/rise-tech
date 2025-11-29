import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { verifyUser, createSession } from '@/lib/auth'

interface LoginInput {
  email: string
  password: string
}

// Login server function
export const login = createServerFn({ method: 'POST' })
  .inputValidator((input: LoginInput) => {
    // Validate required fields
    if (!input.email || !input.password) {
      throw new Error('Email and password are required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(input.email)) {
      throw new Error('Invalid email format')
    }

    return input
  })
  .handler(async ({ data }) => {
    // Verify user credentials
    const user = await verifyUser({
      email: data.email,
      password: data.password,
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Create session
    const sessionToken = await createSession(user.id)

    // Set the session cookie directly in the response
    setCookie('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user info
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  })
