import { createServerFn } from '@tanstack/react-start'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  users,
  courseEnrollments,
  projects,
  mentorAssignments,
} from '@/lib/schema'
import { requireAdminFromCookie } from '@/lib/serverHelpers'

interface UpdateUserInput {
  id: number
  name?: string
  email?: string
  role?: 'learner' | 'mentor' | 'admin'
}

// Get all users with details
export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminFromCookie()

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))

  // Enrich with additional stats
  const enrichedUsers = await Promise.all(
    allUsers.map(async (user) => {
      // Count enrollments
      const enrollments = await db
        .select()
        .from(courseEnrollments)
        .where(eq(courseEnrollments.userId, user.id))

      // Count projects
      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, user.id))

      // For mentors, count assigned learners
      let assignedLearners = 0
      if (user.role === 'mentor') {
        const assignments = await db
          .select()
          .from(mentorAssignments)
          .where(eq(mentorAssignments.mentorId, user.id))
        assignedLearners = assignments.length
      }

      return {
        ...user,
        enrollmentCount: enrollments.length,
        projectCount: userProjects.length,
        assignedLearners,
      }
    }),
  )

  return {
    success: true,
    users: enrichedUsers,
  }
})

// Get a single user by ID
export const getUser = createServerFn({ method: 'GET' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid user ID is required')
    }
    return id
  })
  .handler(async ({ data: userId }) => {
    await requireAdminFromCookie()

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new Error('User not found')
    }

    // Get enrollments
    const enrollments = await db
      .select()
      .from(courseEnrollments)
      .where(eq(courseEnrollments.userId, userId))

    // Get projects
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))

    return {
      success: true,
      user: {
        ...user,
        enrollments,
        projects: userProjects,
      },
    }
  })

// Update a user (admin only)
export const updateUser = createServerFn({ method: 'POST' })
  .inputValidator((input: UpdateUserInput) => {
    if (!input.id) {
      throw new Error('User ID is required')
    }
    if (input.role && !['learner', 'mentor', 'admin'].includes(input.role)) {
      throw new Error('Invalid role')
    }
    return input
  })
  .handler(async ({ data }) => {
    await requireAdminFromCookie()

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, data.id))
      .limit(1)

    if (!existing) {
      throw new Error('User not found')
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.role) updateData.role = data.role

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, data.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return {
      success: true,
      user: updatedUser,
    }
  })

// Delete a user (admin only)
export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid user ID is required')
    }
    return id
  })
  .handler(async ({ data: userId }) => {
    await requireAdminFromCookie()

    // Check if user exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existing) {
      throw new Error('User not found')
    }

    // Don't allow deleting yourself
    // Note: In production, you'd check against the current user

    await db.delete(users).where(eq(users.id, userId))

    return {
      success: true,
      message: 'User deleted successfully',
    }
  })
