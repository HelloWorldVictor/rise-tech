import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  BookOpen,
  Lightbulb,
  FolderOpen,
  Activity,
  ArrowUpRight,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatsCard } from '@/components/shared'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getAdminStats,
  getRecentActivity,
  getTopCourses,
  getChallengeStats,
} from '@/server/admin'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const Route = createFileRoute('/_admin/admin/')({
  component: AdminDashboard,
})

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

function AdminDashboard() {
  // Fetch admin stats
  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats(),
  })

  // Fetch recent activity
  const activityQuery = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => getRecentActivity(),
  })

  // Fetch top courses
  const coursesQuery = useQuery({
    queryKey: ['admin', 'topCourses'],
    queryFn: () => getTopCourses(),
  })

  // Fetch challenge stats
  const challengesQuery = useQuery({
    queryKey: ['admin', 'challengeStats'],
    queryFn: () => getChallengeStats(),
  })

  useEffect(() => {
    if (statsQuery.error) {
      toast.error('Failed to load dashboard stats')
    }
  }, [statsQuery.error])

  const stats = statsQuery.data?.stats
  const activities = activityQuery.data?.activities || []
  const topCourses = coursesQuery.data?.courses || []
  const challengeStats = challengesQuery.data?.challenges || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsQuery.isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.users.total.toLocaleString() || '0'}
              description={`${stats?.users.activeThisMonth || 0} new this month`}
              icon={<Users className="h-4 w-4" />}
              trend={
                stats?.users.activeThisMonth
                  ? { value: stats.users.activeThisMonth, isPositive: true }
                  : undefined
              }
            />
            <StatsCard
              title="Total Courses"
              value={stats?.courses.total || 0}
              description={`${stats?.enrollments.total || 0} total enrollments`}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Challenges"
              value={stats?.challenges.active || 0}
              description={`${stats?.challenges.upcoming || 0} upcoming`}
              icon={<Lightbulb className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Projects"
              value={stats?.projects.total || 0}
              description={`${stats?.projects.submitted || 0} pending review`}
              icon={<FolderOpen className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      {/* User Breakdown & Course Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Breakdown
            </CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            {statsQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Learners</p>
                      <p className="text-sm text-muted-foreground">
                        Active students
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats?.users.learners || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Mentors</p>
                      <p className="text-sm text-muted-foreground">
                        Project reviewers
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats?.users.mentors || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                      <ClipboardCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">Admins</p>
                      <p className="text-sm text-muted-foreground">
                        Platform managers
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats?.users.admins || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Course Analytics</CardTitle>
            <CardDescription>Enrollment and completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            {statsQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-8" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {stats?.enrollments.total || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Enrollments
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {stats?.enrollments.completed || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {stats?.reviews.total || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Project Reviews
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Course Progress</span>
                    <span className="font-medium">
                      {stats?.enrollments.avgProgress || 0}%
                    </span>
                  </div>
                  <Progress
                    value={stats?.enrollments.avgProgress || 0}
                    className="h-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
            <CardDescription>By enrollment count</CardDescription>
          </CardHeader>
          <CardContent>
            {coursesQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : topCourses.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No courses yet. Create your first course to see stats here.
              </div>
            ) : (
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.enrollments.toLocaleString()} enrollments •{' '}
                          {course.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{course.completionRate}%</p>
                      <p className="text-xs text-muted-foreground">
                        completion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            {activityQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : activities.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No recent activity
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {formatTimeAgo(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Challenge Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Active Challenge Performance</CardTitle>
          <CardDescription>Participation and submission stats</CardDescription>
        </CardHeader>
        <CardContent>
          {challengesQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : challengeStats.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No active challenges. Create a challenge to see stats here.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {challengeStats.map((challenge) => (
                <div key={challenge.id} className="rounded-lg border p-4">
                  <h4 className="font-medium line-clamp-1">
                    {challenge.title}
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold">
                        {challenge.participants}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Participants
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {challenge.submissions}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submissions
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span>Submission Rate</span>
                      <span>
                        {challenge.participants > 0
                          ? Math.round(
                              (challenge.submissions / challenge.participants) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        challenge.participants > 0
                          ? (challenge.submissions / challenge.participants) *
                            100
                          : 0
                      }
                      className="mt-1 h-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total Projects
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.projects.total || 0}
            </p>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                Pending Review
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.projects.submitted || 0}
            </p>
            <p className="text-xs text-yellow-500">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.projects.approved || 0}
            </p>
            <p className="text-xs text-green-500">Successfully reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Completion Rate
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.enrollments.avgProgress || 0}%
            </p>
            <p className="text-xs text-muted-foreground">
              Avg. course progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
