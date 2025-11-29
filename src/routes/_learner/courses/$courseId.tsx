import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  Award,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_learner/courses/$courseId')({
  component: CourseDetailPage,
})

function CourseDetailPage() {
  const { courseId } = Route.useParams()

  // Placeholder data
  const course = {
    id: courseId,
    title: 'Introduction to Web Development',
    instructor: 'Dr. Amina Okafor',
    instructorBio:
      'Senior Software Engineer with 10+ years of experience in web development.',
    description:
      'Learn the fundamentals of HTML, CSS, and JavaScript to build modern, responsive websites. This comprehensive course covers everything from basic syntax to advanced concepts like CSS Grid and Flexbox.',
    duration: '12 hours',
    students: 1250,
    rating: 4.8,
    reviews: 320,
    level: 'Beginner',
    category: 'Web Development',
    enrolled: true,
    progress: 65,
    lastUpdated: 'November 2024',
    language: 'English',
    certificate: true,
    whatYouWillLearn: [
      'Build responsive websites using HTML5 and CSS3',
      'Write clean, maintainable JavaScript code',
      'Understand DOM manipulation and event handling',
      'Create layouts with CSS Flexbox and Grid',
      'Deploy your websites to the internet',
      'Best practices for web accessibility',
    ],
    requirements: [
      'Basic computer literacy',
      'No prior programming experience required',
      'A computer with internet access',
    ],
  }

  const modules = [
    {
      id: '1',
      title: 'Getting Started with HTML',
      duration: '2 hours',
      lessons: [
        {
          id: '1',
          title: 'Introduction to HTML',
          duration: '15 min',
          completed: true,
        },
        {
          id: '2',
          title: 'HTML Document Structure',
          duration: '20 min',
          completed: true,
        },
        {
          id: '3',
          title: 'Working with Text Elements',
          duration: '25 min',
          completed: true,
        },
        {
          id: '4',
          title: 'Links and Images',
          duration: '20 min',
          completed: true,
        },
        { id: '5', title: 'HTML Forms', duration: '30 min', completed: true },
      ],
    },
    {
      id: '2',
      title: 'CSS Fundamentals',
      duration: '3 hours',
      lessons: [
        {
          id: '6',
          title: 'Introduction to CSS',
          duration: '20 min',
          completed: true,
        },
        {
          id: '7',
          title: 'Selectors and Properties',
          duration: '25 min',
          completed: true,
        },
        {
          id: '8',
          title: 'The Box Model',
          duration: '30 min',
          completed: true,
        },
        {
          id: '9',
          title: 'CSS Flexbox Layouts',
          duration: '35 min',
          completed: false,
        },
        {
          id: '10',
          title: 'CSS Grid Layouts',
          duration: '40 min',
          completed: false,
        },
        {
          id: '11',
          title: 'Responsive Design',
          duration: '30 min',
          completed: false,
        },
      ],
    },
    {
      id: '3',
      title: 'JavaScript Basics',
      duration: '4 hours',
      lessons: [
        {
          id: '12',
          title: 'Introduction to JavaScript',
          duration: '20 min',
          completed: false,
        },
        {
          id: '13',
          title: 'Variables and Data Types',
          duration: '30 min',
          completed: false,
        },
        {
          id: '14',
          title: 'Functions and Scope',
          duration: '35 min',
          completed: false,
        },
        {
          id: '15',
          title: 'Arrays and Objects',
          duration: '40 min',
          completed: false,
        },
        {
          id: '16',
          title: 'DOM Manipulation',
          duration: '45 min',
          completed: false,
        },
        {
          id: '17',
          title: 'Event Handling',
          duration: '40 min',
          completed: false,
        },
      ],
    },
    {
      id: '4',
      title: 'Building Your First Website',
      duration: '3 hours',
      lessons: [
        {
          id: '18',
          title: 'Project Setup',
          duration: '15 min',
          completed: false,
        },
        {
          id: '19',
          title: 'Creating the HTML Structure',
          duration: '30 min',
          completed: false,
        },
        {
          id: '20',
          title: 'Styling with CSS',
          duration: '45 min',
          completed: false,
        },
        {
          id: '21',
          title: 'Adding Interactivity',
          duration: '45 min',
          completed: false,
        },
        {
          id: '22',
          title: 'Deploying Your Site',
          duration: '30 min',
          completed: false,
        },
        {
          id: '23',
          title: 'Final Project Review',
          duration: '15 min',
          completed: false,
        },
      ],
    },
  ]

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
      </Button>

      {/* Course Header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">
                  ({course.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {course.students.toLocaleString()} students
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div>
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-muted-foreground">
                  {course.instructorBio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="aspect-video rounded-md bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            {course.enrolled ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completedLessons} of {totalLessons} lessons completed
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-3xl font-bold">Free</p>
                  <p className="text-sm text-muted-foreground">
                    Lifetime access
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Enroll Now
                </Button>
              </>
            )}
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                {totalLessons} lessons
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {course.duration} total
              </p>
              {course.certificate && (
                <p className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  Certificate of completion
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Module {moduleIndex + 1}: {module.title}
                    </CardTitle>
                    <CardDescription>
                      {module.lessons.length} lessons • {module.duration}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {module.lessons.filter((l) => l.completed).length}/
                    {module.lessons.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : course.enrolled ? (
                          <Play className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span
                          className={
                            lesson.completed ? 'text-muted-foreground' : ''
                          }
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>
                {course.reviews} reviews • {course.rating} average rating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Alice Mwangi',
                    rating: 5,
                    date: '2 weeks ago',
                    comment:
                      'Excellent course! The instructor explains concepts clearly and the projects are very practical.',
                  },
                  {
                    name: 'David Osei',
                    rating: 5,
                    date: '1 month ago',
                    comment:
                      'This course helped me land my first web development job. Highly recommended!',
                  },
                  {
                    name: 'Grace Njoroge',
                    rating: 4,
                    date: '1 month ago',
                    comment:
                      'Great content overall. Would love to see more advanced topics covered.',
                  },
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
