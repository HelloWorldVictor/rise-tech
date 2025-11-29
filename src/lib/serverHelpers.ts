import { getCookie as tanstackGetCookie } from '@tanstack/react-start/server'
import { getUserFromSession, type SafeUser } from './auth'

const SESSION_COOKIE_NAME = 'sessionToken'

/**
 * Parse cookies from a cookie header string
 */
export function parseCookie(cookieHeader: string): Record<string, string> {
  if (!cookieHeader) {
    return {}
  }

  return Object.fromEntries(
    cookieHeader.split(';').map((cookie) => {
      const [key, ...valueParts] = cookie.trim().split('=')
      return [key, valueParts.join('=')]
    }),
  )
}

/**
 * Get session token from request
 */
export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = parseCookie(cookieHeader)
  return cookies[SESSION_COOKIE_NAME] || null
}

/**
 * Get the current user from server context (using TanStack Start's getCookie)
 */
export async function getUserFromCookie(): Promise<SafeUser | null> {
  const token = tanstackGetCookie(SESSION_COOKIE_NAME)

  if (!token) {
    return null
  }

  return getUserFromSession(token)
}

/**
 * Get the current user from request, returns null if not authenticated
 */
export async function getUser(request: Request): Promise<SafeUser | null> {
  const token = getSessionToken(request)

  if (!token) {
    return null
  }

  return getUserFromSession(token)
}

/**
 * Require a user to be authenticated (using TanStack Start's getCookie)
 * Throws if not authenticated
 */
export async function requireUserFromCookie(): Promise<SafeUser> {
  const user = await getUserFromCookie()

  if (!user) {
    throw new AuthError('Unauthorized', 401)
  }

  return user
}

/**
 * Require a user to be authenticated, throws if not
 */
export async function requireUser(request: Request): Promise<SafeUser> {
  const user = await getUser(request)

  if (!user) {
    throw new AuthError('Unauthorized', 401)
  }

  return user
}

/**
 * Require a specific role (using TanStack Start's getCookie)
 */
export async function requireRoleFromCookie(
  roles: string | string[],
): Promise<SafeUser> {
  const user = await requireUserFromCookie()

  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError('Forbidden', 403)
  }

  return user
}

/**
 * Require a specific role, throws if user doesn't have the role
 */
export async function requireRole(
  request: Request,
  roles: string | string[],
): Promise<SafeUser> {
  const user = await requireUser(request)

  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError('Forbidden', 403)
  }

  return user
}

/**
 * Require admin role (using TanStack Start's getCookie)
 */
export async function requireAdminFromCookie(): Promise<SafeUser> {
  return requireRoleFromCookie('admin')
}

/**
 * Require mentor role (using TanStack Start's getCookie)
 */
export async function requireMentorFromCookie(): Promise<SafeUser> {
  return requireRoleFromCookie(['mentor', 'admin'])
}

/**
 * Require admin role
 */
export async function requireAdmin(request: Request): Promise<SafeUser> {
  return requireRole(request, 'admin')
}

/**
 * Require mentor role
 */
export async function requireMentor(request: Request): Promise<SafeUser> {
  return requireRole(request, ['mentor', 'admin'])
}

/**
 * Create a session cookie string
 */
export function createSessionCookie(
  token: string,
  maxAgeDays: number = 7,
): string {
  const maxAge = maxAgeDays * 24 * 60 * 60 // Convert days to seconds
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; ${secure}Path=/; Max-Age=${maxAge}; SameSite=Lax`
}

/**
 * Create a cookie string to clear the session
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`
}

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = statusCode
  }
}

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse(
  data: unknown,
  status: number = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status)
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): Response {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.statusCode)
  }

  if (error instanceof Error) {
    console.error('API Error:', error)
    return errorResponse(error.message, 500)
  }

  console.error('Unknown API Error:', error)
  return errorResponse('Internal server error', 500)
}
