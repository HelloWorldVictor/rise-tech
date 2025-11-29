import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar } from 'lucide-react'
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

export const Route = createFileRoute('/_learner/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Placeholder data
  const projects = [
    {
      id: '1',
      title: 'FinTrack - SME Financial Management App',
      description:
        'A mobile-first financial management solution for small businesses in Africa.',
      status: 'submitted',
      challenge: 'Build a FinTech Solution for SMEs',
      createdAt: '2024-11-20',
      tags: ['FinTech', 'React Native', 'Node.js'],
      thumbnail: '/placeholder-project.jpg',
      views: 156,
    },
    {
      id: '2',
      title: 'AgriConnect - Farmer Marketplace',
      description:
        'Connecting farmers directly with buyers through a simple mobile platform.',
      status: 'in-review',
      challenge: 'AgriTech Innovation Challenge',
      createdAt: '2024-11-15',
      tags: ['AgriTech', 'Next.js', 'PostgreSQL'],
      thumbnail: '/placeholder-project.jpg',
      views: 89,
    },
    {
      id: '3',
      title: 'Personal Portfolio Website',
      description: 'My developer portfolio showcasing my projects and skills.',
      status: 'draft',
      challenge: null,
      createdAt: '2024-11-10',
      tags: ['Portfolio', 'React', 'Tailwind CSS'],
      thumbnail: '/placeholder-project.jpg',
      views: 45,
    },
    {
      id: '4',
      title: 'E-Commerce Dashboard',
      description: 'An admin dashboard for managing an e-commerce platform.',
      status: 'approved',
      challenge: 'E-Commerce for Local Artisans',
      createdAt: '2024-10-28',
      tags: ['E-Commerce', 'Vue.js', 'Firebase'],
      thumbnail: '/placeholder-project.jpg',
      views: 234,
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'submitted':
        return <Badge className="bg-blue-500">Submitted</Badge>
      case 'in-review':
        return <Badge className="bg-yellow-500">In Review</Badge>
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Needs Revision</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and showcase your portfolio
          </p>
        </div>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'approved').length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'in-review').length}
            </div>
            <p className="text-sm text-muted-foreground">In Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {projects.reduce((acc, p) => acc + p.views, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="mb-3 h-40 rounded-md bg-muted" />
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">
                    {project.title}
                  </CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                {project.challenge && (
                  <CardDescription className="line-clamp-1">
                    Challenge: {project.challenge}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 border-t pt-4">
                <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {project.views} views
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="folder"
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your portfolio by creating your first project'
          }
          action={{
            label:
              searchQuery || statusFilter !== 'all'
                ? 'Clear filters'
                : 'Create Project',
            onClick: () => {
              if (searchQuery || statusFilter !== 'all') {
                setSearchQuery('')
                setStatusFilter('all')
              }
            },
          }}
        />
      )}
    </div>
  )
}
