import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Send,
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getChallenges } from '@/server/admin/challenges'
import { createProject } from '@/server/projects'
import { toast } from 'sonner'

export const Route = createFileRoute('/_learner/projects/new')({
  component: NewProjectPage,
})

function NewProjectPage() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [challengeId, setChallengeId] = useState<string>('')
  const [repoUrl, setRepoUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')

  // Fetch challenges from server
  const { data: challengesData } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges(),
  })

  const activeChallenges = (challengesData?.challenges || []).filter(
    (c) => c.status === 'active',
  )

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createProject>[0]['data']) =>
      createProject({ data }),
    onSuccess: () => {
      toast.success('Project created successfully!')
      router.navigate({ to: '/projects' })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create project',
      )
    },
  })

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in required fields')
      return
    }

    createMutation.mutate({
      title,
      description,
      tags,
      repoUrl: repoUrl || undefined,
      demoUrl: demoUrl || undefined,
      challengeId:
        challengeId && challengeId !== 'none'
          ? parseInt(challengeId)
          : undefined,
    })
  }

  const handleSaveDraft = () => {
    // For now, same as submit but could set status to 'draft'
    handleSubmit()
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="mt-1 text-muted-foreground">
          Showcase your work and submit to challenges
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Provide information about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., FinTrack - SME Financial Management App"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, what problem it solves, and how it works..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge">
                  Submit to Challenge (Optional)
                </Label>
                <Select value={challengeId} onValueChange={setChallengeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No challenge</SelectItem>
                    {activeChallenges.map((challenge) => (
                      <SelectItem
                        key={challenge.id}
                        value={String(challenge.id)}
                      >
                        {challenge.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Link this project to an active challenge for submission
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
              <CardDescription>
                Add links to your project resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Repository</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="github"
                    placeholder="https://github.com/username/repo"
                    className="pl-9"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo">Live Demo URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="demo"
                    placeholder="https://myproject.vercel.app"
                    className="pl-9"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Demo Video URL (Optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="video"
                    placeholder="https://youtube.com/watch?v=..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Images</CardTitle>
              <CardDescription>
                Upload screenshots or images of your project (UI only - no
                actual upload)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Placeholder uploaded images */}
                {[1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video rounded-lg border bg-muted"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Upload placeholder */}
                <div className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-muted/50">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {createMutation.error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {createMutation.error instanceof Error
                    ? createMutation.error.message
                    : 'Failed to create project'}
                </div>
              )}
              <Button
                className="w-full"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={createMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                {createMutation.isPending ? 'Submitting...' : 'Submit Project'}
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Submitted projects will be reviewed by mentors before appearing
                in your portfolio.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for a Great Project</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Write a clear, descriptive title
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Explain the problem your project solves
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Include high-quality screenshots
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Add a working demo link if possible
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Use relevant tags for discoverability
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
