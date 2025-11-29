import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Filter, Clock, Users, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmptyState } from '@/components/shared'

export const Route = createFileRoute('/_learner/courses/')({
  component: CoursesPage,
})

function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Placeholder data
  const courses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      instructor: 'Dr. Amina Okafor',
      description:
        'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
      duration: '12 hours',
      students: 1250,
      rating: 4.8,
      level: 'Beginner',
      category: 'Web Development',
      thumbnail: '/placeholder-course.jpg',
    },
    {
      id: '2',
      title: 'Python for Data Science',
      instructor: 'Prof. Kwame Asante',
      description:
        'Master Python programming and data analysis with pandas, numpy, and matplotlib.',
      duration: '20 hours',
      students: 980,
      rating: 4.9,
      level: 'Intermediate',
      category: 'Data Science',
      thumbnail: '/placeholder-course.jpg',
    },
    {
      id: '3',
      title: 'Mobile App Development with React Native',
      instructor: 'Sarah Johnson',
      description:
        'Build cross-platform mobile apps using React Native and JavaScript.',
      duration: '18 hours',
      students: 750,
      rating: 4.7,
      level: 'Intermediate',
      category: 'Mobile Development',
      thumbnail: '/placeholder-course.jpg',
    },
    {
      id: '4',
      title: 'Machine Learning Fundamentals',
      instructor: 'Dr. Fatima Hassan',
      description:
        'Understand the core concepts of machine learning and build your first ML models.',
      duration: '25 hours',
      students: 620,
      rating: 4.6,
      level: 'Advanced',
      category: 'Data Science',
      thumbnail: '/placeholder-course.jpg',
    },
    {
      id: '5',
      title: 'Cloud Computing with AWS',
      instructor: 'Michael Chen',
      description:
        'Learn to deploy and manage applications on Amazon Web Services.',
      duration: '15 hours',
      students: 890,
      rating: 4.8,
      level: 'Intermediate',
      category: 'Cloud Computing',
      thumbnail: '/placeholder-course.jpg',
    },
    {
      id: '6',
      title: 'UI/UX Design Principles',
      instructor: 'Aisha Mensah',
      description:
        'Master the fundamentals of user interface and user experience design.',
      duration: '10 hours',
      students: 1100,
      rating: 4.9,
      level: 'Beginner',
      category: 'Design',
      thumbnail: '/placeholder-course.jpg',
    },
  ]

  const categories = [
    'all',
    'Web Development',
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'Design',
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' || course.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <p className="mt-1 text-muted-foreground">
          Explore our curated collection of tech courses
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCourses.length} of {courses.length} courses
      </p>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="mb-3 h-40 rounded-md bg-muted" />
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-lg">
                    {course.title}
                  </CardTitle>
                </div>
                <CardDescription>{course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={getLevelColor(course.level)}
                  >
                    {course.level}
                  </Badge>
                  <Badge variant="secondary">{course.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t pt-4">
                <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: course.id }}
                  >
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="search"
          title="No courses found"
          description="Try adjusting your search or filter criteria"
          action={{
            label: 'Clear filters',
            onClick: () => {
              setSearchQuery('')
              setCategoryFilter('all')
            },
          }}
        />
      )}
    </div>
  )
}
