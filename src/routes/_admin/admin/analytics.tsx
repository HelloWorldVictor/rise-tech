import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  BookOpen,
  FolderOpen,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getAdminStats, getTopCourses } from '@/server/admin'

export const Route = createFileRoute('/_admin/admin/analytics')({
  component: AdminAnalyticsPage,
})

function AdminAnalyticsPage() {
  // Fetch admin stats
  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats(),
  })

  // Fetch top courses
  const coursesQuery = useQuery({
    queryKey: ['admin', 'topCourses'],
    queryFn: () => getTopCourses(),
  })

  const stats = statsQuery.data?.stats
  const topCourses = coursesQuery.data?.courses || []

  // Calculate derived metrics
  const completionRate =
    stats?.enrollments.total && stats.enrollments.total > 0
      ? Math.round(
          (stats.enrollments.completed / stats.enrollments.total) * 100,
        )
      : 0

  const projectApprovalRate =
    stats?.projects.total && stats.projects.total > 0
      ? Math.round((stats.projects.approved / stats.projects.total) * 100)
      : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Platform performance metrics and insights
        </p>
      </div>

      {/* Overview Cards */}
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
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">
                      {stats?.users.total || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    +{stats?.users.activeThisMonth || 0}
                  </span>
                  <span className="text-muted-foreground">this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Enrollments
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.enrollments.total || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">
                    {stats?.enrollments.completed || 0} completed
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.projects.total || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">
                    {stats?.projects.approved || 0} approved
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Project Reviews
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.reviews.total || 0}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">
                    {stats?.projects.submitted || 0} pending
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              User Distribution
            </CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            {statsQuery.isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Learners</span>
                      <span className="text-sm font-medium">
                        {stats?.users.learners || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        stats?.users.total
                          ? ((stats.users.learners || 0) / stats.users.total) *
                            100
                          : 0
                      }
                      className="h-3 bg-blue-100 dark:bg-blue-900"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Mentors</span>
                      <span className="text-sm font-medium">
                        {stats?.users.mentors || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        stats?.users.total
                          ? ((stats.users.mentors || 0) / stats.users.total) *
                            100
                          : 0
                      }
                      className="h-3 bg-purple-100 dark:bg-purple-900"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Admins</span>
                      <span className="text-sm font-medium">
                        {stats?.users.admins || 0}
                      </span>
                    </div>
                    <Progress
                      value={
                        stats?.users.total
                          ? ((stats.users.admins || 0) / stats.users.total) *
                            100
                          : 0
                      }
                      className="h-3 bg-orange-100 dark:bg-orange-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {stats?.users.total
                        ? Math.round(
                            ((stats.users.learners || 0) / stats.users.total) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Learners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {stats?.users.total
                        ? Math.round(
                            ((stats.users.mentors || 0) / stats.users.total) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Mentors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {stats?.users.total
                        ? Math.round(
                            ((stats.users.admins || 0) / stats.users.total) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Course Performance
            </CardTitle>
            <CardDescription>Enrollments by course</CardDescription>
          </CardHeader>
          <CardContent>
            {coursesQuery.isLoading ? (
              <Skeleton className="h-64" />
            ) : topCourses.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No course data available
              </div>
            ) : (
              <div className="space-y-4">
                {topCourses.map((course) => (
                  <div key={course.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm truncate max-w-[200px]">
                        {course.title}
                      </span>
                      <span className="text-sm font-medium">
                        {course.enrollments}
                      </span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.completionRate}% completion rate
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rate</CardTitle>
            <CardDescription>
              Percentage of completed enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${completionRate * 3.52} 352`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{completionRate}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {stats?.enrollments.completed || 0} of{' '}
              {stats?.enrollments.total || 0} enrollments completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Approval Rate</CardTitle>
            <CardDescription>Percentage of approved projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${projectApprovalRate * 3.52} 352`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {projectApprovalRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {stats?.projects.approved || 0} of {stats?.projects.total || 0}{' '}
              projects approved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Progress</CardTitle>
            <CardDescription>Mean course completion progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(stats?.enrollments.avgProgress || 0) * 3.52} 352`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {stats?.enrollments.avgProgress || 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Across {stats?.enrollments.total || 0} active enrollments
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge & Content Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Challenge Statistics</CardTitle>
            <CardDescription>Innovation challenge metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold">
                  {stats?.challenges.total || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                <p className="text-3xl font-bold text-green-600">
                  {stats?.challenges.active || 0}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.challenges.upcoming || 0}
                </p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Statistics</CardTitle>
            <CardDescription>Learner project metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold">
                  {stats?.projects.total || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <p className="text-3xl font-bold text-yellow-600">
                  {stats?.projects.submitted || 0}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                <p className="text-3xl font-bold text-green-600">
                  {stats?.projects.approved || 0}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
