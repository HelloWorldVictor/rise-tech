import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects } from '@/lib/schema'
import { requireUserFromCookie } from '@/lib/serverHelpers'

interface CreateProjectInput {
  title: string
  description: string
  tags?: string[]
  images?: string[]
  demoUrl?: string
  repoUrl?: string
  challengeId?: number
}

interface UpdateProjectInput {
  id: number
  title?: string
  description?: string
  tags?: string[]
  images?: string[]
  demoUrl?: string
  repoUrl?: string
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}

// Create a new project
export const createProject = createServerFn({ method: 'POST' })
  .inputValidator((input: CreateProjectInput) => {
    if (!input.title || !input.description) {
      throw new Error('Title and description are required')
    }

    if (input.title.length < 3) {
      throw new Error('Title must be at least 3 characters long')
    }

    if (input.description.length < 10) {
      throw new Error('Description must be at least 10 characters long')
    }

    return input
  })
  .handler(async ({ data }) => {
    const user = await requireUserFromCookie()

    const result = await db
      .insert(projects)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        images: data.images || [],
        demoUrl: data.demoUrl,
        repoUrl: data.repoUrl,
        challengeId: data.challengeId,
        status: 'draft',
      })
      .returning()

    return {
      success: true,
      project: result[0],
    }
  })

// Get user's projects
export const getUserProjects = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUserFromCookie()

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(projects.createdAt)

    return {
      success: true,
      projects: userProjects,
    }
  },
)

// Get a single project by ID
export const getProject = createServerFn({ method: 'GET' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid project ID is required')
    }
    return id
  })
  .handler(async ({ data: projectId }) => {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    const project = result[0]

    if (!project) {
      throw new Error('Project not found')
    }

    return {
      success: true,
      project,
    }
  })

// Update a project
export const updateProject = createServerFn({ method: 'POST' })
  .inputValidator((input: UpdateProjectInput) => {
    if (!input.id) {
      throw new Error('Project ID is required')
    }
    return input
  })
  .handler(async ({ data }) => {
    const user = await requireUserFromCookie()

    // Check if project belongs to user
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.id, data.id))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Project not found')
    }

    if (existing[0].userId !== user.id) {
      throw new Error('You can only update your own projects')
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title) updateData.title = data.title
    if (data.description) updateData.description = data.description
    if (data.tags) updateData.tags = data.tags
    if (data.images) updateData.images = data.images
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl
    if (data.repoUrl !== undefined) updateData.repoUrl = data.repoUrl
    if (data.status) updateData.status = data.status

    const result = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, data.id))
      .returning()

    return {
      success: true,
      project: result[0],
    }
  })

// Delete a project
export const deleteProject = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid project ID is required')
    }
    return id
  })
  .handler(async ({ data: projectId }) => {
    const user = await requireUserFromCookie()

    // Check if project belongs to user
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Project not found')
    }

    if (existing[0].userId !== user.id) {
      throw new Error('You can only delete your own projects')
    }

    await db.delete(projects).where(eq(projects.id, projectId))

    return {
      success: true,
      message: 'Project deleted successfully',
    }
  })

// Submit a project for review
export const submitProject = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid project ID is required')
    }
    return id
  })
  .handler(async ({ data: projectId }) => {
    const user = await requireUserFromCookie()

    // Check if project belongs to user
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Project not found')
    }

    if (existing[0].userId !== user.id) {
      throw new Error('You can only submit your own projects')
    }

    if (existing[0].status !== 'draft') {
      throw new Error('Only draft projects can be submitted')
    }

    const result = await db
      .update(projects)
      .set({ status: 'submitted', updatedAt: new Date() })
      .where(eq(projects.id, projectId))
      .returning()

    return {
      success: true,
      project: result[0],
    }
  })
