import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  Lightbulb,
  Trophy,
  Clock,
  ArrowRight,
  Play,
  Target,
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
import { useAuth } from '@/lib/auth-context'
import { getCourses } from '@/server/admin/courses'
import { getChallenges } from '@/server/admin/challenges'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'

export const Route = createFileRoute('/_learner/dashboard')({
  component: LearnerDashboard,
})

function LearnerDashboard() {
  const { user } = useAuth()

  // Fetch courses from server
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  })

  // Fetch challenges from server
  const {
    data: challengesData,
    isLoading: challengesLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges(),
  })

  // Show error toasts
  useEffect(() => {
    if (coursesError) {
      toast.error('Failed to load courses. Please try again.')
    }
  }, [coursesError])

  useEffect(() => {
    if (challengesError) {
      toast.error('Failed to load challenges. Please try again.')
    }
  }, [challengesError])

  const courses = coursesData?.courses || []
  const challenges = challengesData?.challenges || []

  // Filter active challenges
  const activeChallenges = challenges.filter((c) => c.status === 'active')

  const recentAchievements = [
    { title: 'First Course Completed', date: '2 days ago' },
    { title: 'Challenge Participant', date: '1 week ago' },
    { title: '7-Day Streak', date: '2 weeks ago' },
  ]

  if (coursesLoading || challengesLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Continue your learning journey. You're doing great!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Courses Available"
          value={String(courses.length)}
          description="Browse and enroll"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Challenges"
          value={String(activeChallenges.length)}
          description="Join and compete"
          icon={<Lightbulb className="h-4 w-4" />}
        />
        <StatsCard
          title="Achievements"
          value="12"
          description="3 this month"
          icon={<Trophy className="h-4 w-4" />}
        />
        <StatsCard
          title="Learning Streak"
          value="7 days"
          description="Keep it up!"
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      {/* Available Courses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Courses</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/courses">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <div className="mb-2 h-32 rounded-md bg-muted" />
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription>
                  {course.instructor || 'Rise Tech Instructor'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {course.duration}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: String(course.id) }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Challenges</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/challenges">
              Browse Challenges
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeChallenges.slice(0, 4).map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {challenge.participants || 0} participants
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{challenge.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{challenge.rewards}</span>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {challenge.brief}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    to="/challenges/$challengeId"
                    params={{ challengeId: String(challenge.id) }}
                  >
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements & Progress Summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{achievement.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {achievement.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
            <CardDescription>Your learning stats this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lessons Completed</span>
                  <span className="font-medium">24 / 50</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quizzes Passed</span>
                  <span className="font-medium">8 / 10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Projects Submitted</span>
                  <span className="font-medium">2 / 5</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/projects">View My Projects</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
