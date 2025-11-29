import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  ClipboardCheck,
  Clock,
  Star,
  ArrowRight,
  Eye,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { StatsCard } from '@/components/shared'
import { useQuery } from '@tanstack/react-query'
import {
  getAssignedLearners,
  getPendingReviews,
  getMentorStats,
} from '@/server/mentor'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const Route = createFileRoute('/_mentor/mentor/dashboard')({
  component: MentorDashboard,
})

function MentorDashboard() {
  const { user } = useAuth()

  // Fetch mentor stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['mentorStats'],
    queryFn: () => getMentorStats(),
  })

  // Fetch assigned learners
  const {
    data: learnersData,
    isLoading: learnersLoading,
    error: learnersError,
  } = useQuery({
    queryKey: ['assignedLearners'],
    queryFn: () => getAssignedLearners(),
  })

  // Fetch pending reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ['pendingReviews'],
    queryFn: () => getPendingReviews(),
  })

  // Show error toasts
  useEffect(() => {
    if (statsError) {
      toast.error('Failed to load mentor stats. Please try again.')
    }
  }, [statsError])

  useEffect(() => {
    if (learnersError) {
      toast.error('Failed to load assigned learners. Please try again.')
    }
  }, [learnersError])

  useEffect(() => {
    if (reviewsError) {
      toast.error('Failed to load pending reviews. Please try again.')
    }
  }, [reviewsError])

  const stats = statsData?.stats
  const assignedLearners = learnersData?.learners || []
  const pendingReviews = reviewsData?.reviews || []

  const getPriorityBadge = (submittedAt: Date | null) => {
    if (!submittedAt) return <Badge variant="secondary">Low</Badge>

    const now = new Date()
    const submitted = new Date(submittedAt)
    const daysPending = Math.floor(
      (now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24),
    )

    if (daysPending >= 7) {
      return <Badge variant="destructive">High Priority</Badge>
    } else if (daysPending >= 3) {
      return <Badge className="bg-yellow-500">Medium</Badge>
    }
    return <Badge variant="secondary">Low</Badge>
  }

  const isLoading = statsLoading || learnersLoading || reviewsLoading

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your mentoring activities
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assigned Learners"
          value={String(stats?.assignedLearners || 0)}
          description="Total learners assigned"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Reviews"
          value={String(stats?.pendingReviews || 0)}
          description="Projects awaiting review"
          icon={<ClipboardCheck className="h-4 w-4" />}
        />
        <StatsCard
          title="Completed Reviews"
          value={String(stats?.completedReviews || 0)}
          description="Total reviews completed"
          icon={<Star className="h-4 w-4" />}
        />
        <StatsCard
          title="Avg. Response Time"
          value="--"
          description="Coming soon"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Pending Reviews */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pending Project Reviews</h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {pendingReviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending reviews. All caught up! 🎉
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <CardDescription>
                        by {review.learnerName} • Submitted{' '}
                        {new Date(review.submittedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getPriorityBadge(review.submittedAt)}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  {review.challengeTitle && (
                    <p className="text-sm text-muted-foreground">
                      Challenge: {review.challengeTitle}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="gap-2">
                  <Button asChild>
                    <Link
                      to="/mentor/reviews/$projectId"
                      params={{ projectId: String(review.id) }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Review Project
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Learner
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Learners */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Learners</h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {assignedLearners.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No learners assigned yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignedLearners.map((learner) => (
              <Card key={learner.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {learner.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {learner.name}
                      </CardTitle>
                      <CardDescription>{learner.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-2 text-sm">{learner.courseName}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {learner.overallProgress}%
                      </span>
                    </div>
                    <Progress value={learner.overallProgress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  <span className="text-xs text-muted-foreground">
                    Joined: {new Date(learner.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
