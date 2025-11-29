import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { courses, type CourseModule } from '@/lib/schema'
import { requireAdminFromCookie } from '@/lib/serverHelpers'

interface CreateCourseInput {
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  instructor?: string
  thumbnail?: string
  modules?: CourseModule[]
}

interface UpdateCourseInput {
  id: number
  title?: string
  description?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  instructor?: string
  thumbnail?: string
  modules?: CourseModule[]
}

// Get all courses (public)
export const getCourses = createServerFn({ method: 'GET' }).handler(
  async () => {
    const allCourses = await db
      .select()
      .from(courses)
      .orderBy(courses.createdAt)

    return {
      success: true,
      courses: allCourses,
    }
  },
)

// Get a single course by ID (public)
export const getCourse = createServerFn({ method: 'GET' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid course ID is required')
    }
    return id
  })
  .handler(async ({ data: courseId }) => {
    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    const course = result[0]

    if (!course) {
      throw new Error('Course not found')
    }

    return {
      success: true,
      course,
    }
  })

// Create a new course (admin only)
export const createCourse = createServerFn({ method: 'POST' })
  .inputValidator((input: CreateCourseInput) => {
    if (!input.title || !input.description || !input.level) {
      throw new Error('Title, description, and level are required')
    }

    if (input.title.length < 3) {
      throw new Error('Title must be at least 3 characters long')
    }

    const validLevels = ['beginner', 'intermediate', 'advanced']
    if (!validLevels.includes(input.level)) {
      throw new Error('Level must be beginner, intermediate, or advanced')
    }

    return input
  })
  .handler(async ({ data }) => {
    await requireAdminFromCookie()

    const result = await db
      .insert(courses)
      .values({
        title: data.title,
        description: data.description,
        level: data.level,
        duration: data.duration,
        instructor: data.instructor,
        thumbnail: data.thumbnail,
        modules: data.modules || [],
      })
      .returning()

    return {
      success: true,
      course: result[0],
    }
  })

// Update a course (admin only)
export const updateCourse = createServerFn({ method: 'POST' })
  .inputValidator((input: UpdateCourseInput) => {
    if (!input.id) {
      throw new Error('Course ID is required')
    }
    return input
  })
  .handler(async ({ data }) => {
    await requireAdminFromCookie()

    // Check if course exists
    const existing = await db
      .select()
      .from(courses)
      .where(eq(courses.id, data.id))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Course not found')
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title) updateData.title = data.title
    if (data.description) updateData.description = data.description
    if (data.level) updateData.level = data.level
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.instructor !== undefined) updateData.instructor = data.instructor
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.modules) updateData.modules = data.modules

    const result = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, data.id))
      .returning()

    return {
      success: true,
      course: result[0],
    }
  })

// Delete a course (admin only)
export const deleteCourse = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid course ID is required')
    }
    return id
  })
  .handler(async ({ data: courseId }) => {
    await requireAdminFromCookie()

    // Check if course exists
    const existing = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Course not found')
    }

    await db.delete(courses).where(eq(courses.id, courseId))

    return {
      success: true,
      message: 'Course deleted successfully',
    }
  })
