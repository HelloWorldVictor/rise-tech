import { createServerFn } from '@tanstack/react-start'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  users,
  projects,
  mentorAssignments,
  courseEnrollments,
  courses,
  challenges,
  projectReviews,
} from '@/lib/schema'
import { requireMentorFromCookie } from '@/lib/serverHelpers'

// Get assigned learners for a mentor
export const getAssignedLearners = createServerFn({ method: 'GET' }).handler(
  async () => {
    const mentor = await requireMentorFromCookie()

    // Get all learner IDs assigned to this mentor
    const assignments = await db
      .select({
        learnerId: mentorAssignments.learnerId,
        assignedAt: mentorAssignments.createdAt,
      })
      .from(mentorAssignments)
      .where(eq(mentorAssignments.mentorId, mentor.id))

    if (assignments.length === 0) {
      return {
        success: true,
        learners: [],
      }
    }

    // Get learner details along with their enrollments
    const learnerIds = assignments.map((a) => a.learnerId)

    const learnerDetails = await Promise.all(
      learnerIds.map(async (learnerId) => {
        // Get user info
        const [user] = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.id, learnerId))
          .limit(1)

        // Get their enrollments with course info
        const enrollments = await db
          .select({
            courseId: courseEnrollments.courseId,
            progress: courseEnrollments.progress,
            courseTitle: courses.title,
          })
          .from(courseEnrollments)
          .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
          .where(eq(courseEnrollments.userId, learnerId))

        // Calculate overall progress (average across courses)
        const avgProgress =
          enrollments.length > 0
            ? Math.round(
                enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
                  enrollments.length,
              )
            : 0

        return {
          ...user,
          enrollments,
          overallProgress: avgProgress,
          courseName: enrollments[0]?.courseTitle || 'No course enrolled',
        }
      }),
    )

    return {
      success: true,
      learners: learnerDetails,
    }
  },
)

// Get pending project reviews for a mentor
export const getPendingReviews = createServerFn({ method: 'GET' }).handler(
  async () => {
    const mentor = await requireMentorFromCookie()

    // Get learner IDs assigned to this mentor
    const assignments = await db
      .select({ learnerId: mentorAssignments.learnerId })
      .from(mentorAssignments)
      .where(eq(mentorAssignments.mentorId, mentor.id))

    if (assignments.length === 0) {
      return {
        success: true,
        reviews: [],
      }
    }

    const learnerIds = assignments.map((a) => a.learnerId)

    // Get submitted projects from assigned learners
    const pendingProjects = await Promise.all(
      learnerIds.map(async (learnerId) => {
        return db
          .select({
            id: projects.id,
            title: projects.title,
            description: projects.description,
            status: projects.status,
            submittedAt: projects.updatedAt,
            challengeId: projects.challengeId,
            userId: projects.userId,
          })
          .from(projects)
          .where(
            and(
              eq(projects.userId, learnerId),
              eq(projects.status, 'submitted'),
            ),
          )
          .orderBy(desc(projects.updatedAt))
      }),
    )

    const allPending = pendingProjects.flat()

    // Enrich with learner name and challenge info
    const enrichedReviews = await Promise.all(
      allPending.map(async (project) => {
        const [learner] = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, project.userId))
          .limit(1)

        let challengeTitle = null
        if (project.challengeId) {
          const [challenge] = await db
            .select({ title: challenges.title })
            .from(challenges)
            .where(eq(challenges.id, project.challengeId))
            .limit(1)
          challengeTitle = challenge?.title
        }

        return {
          ...project,
          learnerName: learner?.name || 'Unknown',
          challengeTitle,
        }
      }),
    )

    return {
      success: true,
      reviews: enrichedReviews,
    }
  },
)

// Submit a review for a project
export const submitProjectReview = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      projectId: number
      feedback: string
      rating?: number
      approved: boolean
    }) => {
      if (!input.projectId) {
        throw new Error('Project ID is required')
      }
      if (!input.feedback || input.feedback.trim().length < 10) {
        throw new Error('Feedback must be at least 10 characters')
      }
      return input
    },
  )
  .handler(async ({ data }) => {
    const mentor = await requireMentorFromCookie()

    // Check if project exists and is submitted
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, data.projectId))
      .limit(1)

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.status !== 'submitted') {
      throw new Error('Project is not in submitted status')
    }

    // Create the review
    const [review] = await db
      .insert(projectReviews)
      .values({
        projectId: data.projectId,
        mentorId: mentor.id,
        feedback: data.feedback,
        rating: data.rating,
        status: data.approved ? 'approved' : 'rejected',
      })
      .returning()

    // Update project status
    await db
      .update(projects)
      .set({
        status: data.approved ? 'approved' : 'rejected',
        updatedAt: new Date(),
      })
      .where(eq(projects.id, data.projectId))

    return {
      success: true,
      review,
    }
  })

// Get a single project for review
export const getProjectForReview = createServerFn({ method: 'GET' })
  .inputValidator((projectId: number) => {
    if (!projectId || typeof projectId !== 'number') {
      throw new Error('Valid project ID is required')
    }
    return projectId
  })
  .handler(async ({ data: projectId }) => {
    await requireMentorFromCookie()

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (!project) {
      throw new Error('Project not found')
    }

    // Get learner info
    const [learner] = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, project.userId))
      .limit(1)

    // Get challenge info if linked
    let challenge = null
    if (project.challengeId) {
      const [ch] = await db
        .select()
        .from(challenges)
        .where(eq(challenges.id, project.challengeId))
        .limit(1)
      challenge = ch
    }

    return {
      success: true,
      project,
      learner,
      challenge,
    }
  })

// Get mentor dashboard stats
export const getMentorStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    const mentor = await requireMentorFromCookie()

    // Count assigned learners
    const assignments = await db
      .select({ count: mentorAssignments.id })
      .from(mentorAssignments)
      .where(eq(mentorAssignments.mentorId, mentor.id))

    // Count completed reviews
    const completedReviews = await db
      .select({ count: projectReviews.id })
      .from(projectReviews)
      .where(eq(projectReviews.mentorId, mentor.id))

    // Count pending reviews from assigned learners
    const learnerIds = (
      await db
        .select({ learnerId: mentorAssignments.learnerId })
        .from(mentorAssignments)
        .where(eq(mentorAssignments.mentorId, mentor.id))
    ).map((a) => a.learnerId)

    let pendingCount = 0
    if (learnerIds.length > 0) {
      for (const learnerId of learnerIds) {
        const pending = await db
          .select({ count: projects.id })
          .from(projects)
          .where(
            and(
              eq(projects.userId, learnerId),
              eq(projects.status, 'submitted'),
            ),
          )
        pendingCount += pending.length
      }
    }

    return {
      success: true,
      stats: {
        assignedLearners: assignments.length,
        pendingReviews: pendingCount,
        completedReviews: completedReviews.length,
      },
    }
  },
)
