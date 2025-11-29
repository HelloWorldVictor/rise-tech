import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Play,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  User,
  Calendar,
  Tag,
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_mentor/mentor/reviews/$projectId')({
  component: ProjectReviewPage,
})

function ProjectReviewPage() {
  const { projectId } = Route.useParams()
  const [feedback, setFeedback] = useState('')
  const [rating, setRating] = useState<string>('')

  // Placeholder data
  const project = {
    id: projectId,
    title: 'FinTrack - SME Financial Management App',
    description:
      'A mobile-first financial management solution designed to help small and medium enterprises in Africa manage their finances more efficiently. The app includes features for expense tracking, invoicing, and financial reporting.',
    learner: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
    },
    challenge: {
      title: 'Build a FinTech Solution for SMEs',
      id: '1',
    },
    submittedAt: '2024-11-25',
    tags: ['FinTech', 'React Native', 'Node.js', 'PostgreSQL'],
    links: {
      github: 'https://github.com/johndoe/fintrack',
      demo: 'https://fintrack-demo.vercel.app',
      video: 'https://youtube.com/watch?v=example',
    },
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg', '/placeholder-3.jpg'],
    technicalDetails: `
## Technical Implementation

### Frontend
- React Native for cross-platform mobile development
- Redux for state management
- Tailwind CSS (via NativeWind) for styling

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication

### Key Features
1. Expense tracking with category management
2. Invoice generation and PDF export
3. Financial dashboard with charts
4. Multi-currency support
5. Offline mode with sync capability
    `,
  }

  const reviewCriteria = [
    { name: 'Innovation', weight: 30 },
    { name: 'Impact', weight: 25 },
    { name: 'Technical Implementation', weight: 25 },
    { name: 'User Experience', weight: 20 },
  ]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/mentor/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-500">Pending Review</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{project.learner.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Submitted{' '}
                    {new Date(project.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
              {project.links.video && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.links.video}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch Video
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Project Images */}
          <Card>
            <CardHeader>
              <CardTitle>Project Screenshots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {project.images.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg border bg-muted"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {project.technicalDetails}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Info */}
          {project.challenge && (
            <Card>
              <CardHeader>
                <CardTitle>Challenge Submission</CardTitle>
                <CardDescription>
                  This project was submitted for a challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4">
                  <p className="font-medium">{project.challenge.title}</p>
                  <Button variant="link" className="h-auto p-0 mt-2" asChild>
                    <Link
                      to="/challenges/$challengeId"
                      params={{ challengeId: project.challenge.id }}
                    >
                      View Challenge Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Review Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Review</CardTitle>
              <CardDescription>
                Evaluate this project and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating Criteria */}
              <div className="space-y-3">
                <Label>Evaluation Criteria</Label>
                {reviewCriteria.map((criterion) => (
                  <div key={criterion.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{criterion.name}</span>
                      <span className="text-muted-foreground">
                        {criterion.weight}%
                      </span>
                    </div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="2">2 - Below Average</SelectItem>
                        <SelectItem value="1">1 - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Detailed Feedback *</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide constructive feedback for the learner..."
                  rows={6}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about what was done well and what could be
                  improved.
                </p>
              </div>

              {/* Overall Decision */}
              <div className="space-y-2">
                <Label>Overall Decision *</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Approve
                      </div>
                    </SelectItem>
                    <SelectItem value="revision">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-yellow-500" />
                        Needs Revision
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Reject
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Review
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learner Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  {project.learner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{project.learner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.learner.email}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Learner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
