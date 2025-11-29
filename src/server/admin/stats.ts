import { createServerFn } from '@tanstack/react-start'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  users,
  courses,
  challenges,
  projects,
  courseEnrollments,
  projectReviews,
} from '@/lib/schema'
import { requireAdminFromCookie } from '@/lib/serverHelpers'

// Get admin dashboard stats
export const getAdminStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdminFromCookie()

    // Count users by role
    const allUsers = await db.select().from(users)
    const totalUsers = allUsers.length
    const learnerCount = allUsers.filter((u) => u.role === 'learner').length
    const mentorCount = allUsers.filter((u) => u.role === 'mentor').length
    const adminCount = allUsers.filter((u) => u.role === 'admin').length

    // Count active users (created in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const activeUsers = allUsers.filter(
      (u) => new Date(u.createdAt) >= thirtyDaysAgo,
    ).length

    // Count courses
    const allCourses = await db.select().from(courses)
    const totalCourses = allCourses.length

    // Count challenges by status
    const allChallenges = await db.select().from(challenges)
    const activeChallenges = allChallenges.filter(
      (c) => c.status === 'active',
    ).length
    const upcomingChallenges = allChallenges.filter(
      (c) => c.status === 'upcoming',
    ).length

    // Count projects by status
    const allProjects = await db.select().from(projects)
    const totalProjects = allProjects.length
    const submittedProjects = allProjects.filter(
      (p) => p.status === 'submitted',
    ).length
    const approvedProjects = allProjects.filter(
      (p) => p.status === 'approved',
    ).length

    // Count enrollments
    const allEnrollments = await db.select().from(courseEnrollments)
    const totalEnrollments = allEnrollments.length
    const completedEnrollments = allEnrollments.filter(
      (e) => e.completedAt !== null,
    ).length
    const avgProgress =
      allEnrollments.length > 0
        ? Math.round(
            allEnrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
              allEnrollments.length,
          )
        : 0

    // Count reviews
    const allReviews = await db.select().from(projectReviews)
    const totalReviews = allReviews.length

    return {
      success: true,
      stats: {
        users: {
          total: totalUsers,
          learners: learnerCount,
          mentors: mentorCount,
          admins: adminCount,
          activeThisMonth: activeUsers,
        },
        courses: {
          total: totalCourses,
        },
        challenges: {
          total: allChallenges.length,
          active: activeChallenges,
          upcoming: upcomingChallenges,
        },
        projects: {
          total: totalProjects,
          submitted: submittedProjects,
          approved: approvedProjects,
        },
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
          avgProgress,
        },
        reviews: {
          total: totalReviews,
        },
      },
    }
  },
)

// Get recent activity for admin dashboard
export const getRecentActivity = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdminFromCookie()

    // Get recent users (last 10)
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10)

    // Get recent projects (last 10)
    const recentProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        status: projects.status,
        userId: projects.userId,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(10)

    // Enrich projects with user names
    const enrichedProjects = await Promise.all(
      recentProjects.map(async (project) => {
        const [user] = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.id, project.userId))
          .limit(1)
        return {
          ...project,
          userName: user?.name || 'Unknown',
        }
      }),
    )

    // Build activity feed
    const activities: Array<{
      type: string
      description: string
      user: string
      time: Date
    }> = []

    recentUsers.forEach((user) => {
      activities.push({
        type: 'user_registered',
        description:
          user.role === 'mentor' ? 'New mentor joined' : 'New user registered',
        user: user.name,
        time: user.createdAt,
      })
    })

    enrichedProjects.forEach((project) => {
      if (project.status === 'submitted') {
        activities.push({
          type: 'project_submitted',
          description: `Project submitted: ${project.title}`,
          user: project.userName,
          time: project.createdAt,
        })
      } else if (project.status === 'approved') {
        activities.push({
          type: 'project_approved',
          description: `Project approved: ${project.title}`,
          user: project.userName,
          time: project.createdAt,
        })
      }
    })

    // Sort by time descending and take top 10
    activities.sort((a, b) => b.time.getTime() - a.time.getTime())
    const topActivities = activities.slice(0, 10)

    return {
      success: true,
      activities: topActivities,
    }
  },
)

// Get top courses by enrollment
export const getTopCourses = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdminFromCookie()

    const allCourses = await db.select().from(courses)

    // Get enrollment counts for each course
    const coursesWithStats = await Promise.all(
      allCourses.map(async (course) => {
        const enrollments = await db
          .select()
          .from(courseEnrollments)
          .where(eq(courseEnrollments.courseId, course.id))

        const completedCount = enrollments.filter(
          (e) => e.completedAt !== null,
        ).length
        const completionRate =
          enrollments.length > 0
            ? Math.round((completedCount / enrollments.length) * 100)
            : 0

        return {
          id: course.id,
          title: course.title,
          level: course.level,
          enrollments: enrollments.length,
          completionRate,
        }
      }),
    )

    // Sort by enrollments descending
    coursesWithStats.sort((a, b) => b.enrollments - a.enrollments)

    return {
      success: true,
      courses: coursesWithStats.slice(0, 5),
    }
  },
)

// Get challenge stats
export const getChallengeStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdminFromCookie()

    const allChallenges = await db
      .select()
      .from(challenges)
      .where(eq(challenges.status, 'active'))

    const challengesWithStats = await Promise.all(
      allChallenges.map(async (challenge) => {
        // Count projects linked to this challenge
        const linkedProjects = await db
          .select()
          .from(projects)
          .where(eq(projects.challengeId, challenge.id))

        const submittedCount = linkedProjects.filter(
          (p) => p.status === 'submitted' || p.status === 'approved',
        ).length

        return {
          id: challenge.id,
          title: challenge.title,
          participants: challenge.participants || linkedProjects.length,
          submissions: submittedCount,
        }
      }),
    )

    return {
      success: true,
      challenges: challengesWithStats,
    }
  },
)
