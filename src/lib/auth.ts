import { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users, sessions, type User, type NewUser } from './schema'

const SALT_ROUNDS = 10
const SESSION_EXPIRY_DAYS = 7

// User without sensitive data
export type SafeUser = Omit<User, 'passwordHash'>

/**
 * Register a new user
 */
export async function registerUser({
  name,
  email,
  password,
  role = 'learner',
}: {
  name: string
  email: string
  password: string
  role?: 'learner' | 'mentor' | 'admin'
}): Promise<SafeUser> {
  // Check if user already exists
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  if (existingUsers.length > 0) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // Insert user
  const result = await db
    .insert(users)
    .values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    })
    .returning()

  const user = result[0]

  // Return user without password hash
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Verify user credentials and return user if valid
 */
export async function verifyUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<SafeUser | null> {
  // Find user by email
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1)

  const user = result[0]

  if (!user) {
    return null
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  // Return user without password hash
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: number): Promise<string> {
  // Generate a secure random token
  const token = randomBytes(48).toString('hex')

  // Calculate expiry date
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  // Insert session
  await db.insert(sessions).values({
    token,
    userId,
    expiresAt,
  })

  return token
}

/**
 * Get user from session token
 */
export async function getUserFromSession(
  token: string,
): Promise<SafeUser | null> {
  if (!token) {
    return null
  }

  // Find session
  const sessionResult = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1)

  const session = sessionResult[0]

  if (!session) {
    return null
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    // Delete expired session
    await db.delete(sessions).where(eq(sessions.token, token))
    return null
  }

  // Get user
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)

  const user = userResult[0]

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token))
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

/**
 * Clean up expired sessions (can be run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const now = new Date()
  const result = await db.delete(sessions).where(eq(sessions.expiresAt, now))
  return result.rowCount ?? 0
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<SafeUser | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)

  const user = result[0]

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Update user profile
 */
export async function updateUser(
  id: number,
  data: Partial<Pick<NewUser, 'name' | 'email'>>,
): Promise<SafeUser | null> {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()

  const user = result[0]

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Change user password
 */
export async function changePassword(
  id: number,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  // Get user with password hash
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)

  const user = result[0]

  if (!user) {
    return false
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash)

  if (!isValid) {
    return false
  }

  // Hash new password and update
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, id))

  return true
}
