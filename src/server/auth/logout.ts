import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie } from '@tanstack/react-start/server'
import { deleteSession } from '@/lib/auth'

// Logout server function
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const token = getCookie('sessionToken')

  if (token) {
    await deleteSession(token)
  }

  // Delete the session cookie
  deleteCookie('sessionToken', {
    path: '/',
  })

  return {
    success: true,
  }
})
