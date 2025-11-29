import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  Trophy,
  Users,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '@/server/admin/challenges'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/challenges')({
  component: AdminChallengesPage,
})

function AdminChallengesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<{
    id: number
    title: string
    brief: string
    description: string
    rewards: string
    status: string
  } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    description: '',
    rewards: '',
    status: 'upcoming' as 'upcoming' | 'active' | 'ended',
  })

  // Fetch challenges
  const {
    data: challengesData,
    isLoading,
    error: challengesError,
  } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => getChallenges(),
  })

  // Show error toast if challenges fail to load
  useEffect(() => {
    if (challengesError) {
      toast.error('Failed to load challenges. Please try again.')
    }
  }, [challengesError])

  const challenges = challengesData?.challenges || []

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => createChallenge({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge created successfully!')
      setIsCreateDialogOpen(false)
      resetForm()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create challenge',
      )
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number
      title?: string
      brief?: string
      description?: string
      rewards?: string
      status?: 'upcoming' | 'active' | 'ended'
    }) => updateChallenge({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge updated successfully!')
      setIsEditDialogOpen(false)
      setEditingChallenge(null)
      resetForm()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update challenge',
      )
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteChallenge({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Challenge deleted successfully!')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete challenge',
      )
    },
  })

  const resetForm = () => {
    setFormData({
      title: '',
      brief: '',
      description: '',
      rewards: '',
      status: 'upcoming',
    })
  }

  const handleEdit = (challenge: (typeof challenges)[0]) => {
    setEditingChallenge({
      id: challenge.id,
      title: challenge.title,
      brief: challenge.brief,
      description: challenge.description || '',
      rewards: challenge.rewards,
      status: challenge.status,
    })
    setFormData({
      title: challenge.title,
      brief: challenge.brief,
      description: challenge.description || '',
      rewards: challenge.rewards,
      status: challenge.status as 'upcoming' | 'active' | 'ended',
    })
    setIsEditDialogOpen(true)
  }

  const handleCreate = () => {
    createMutation.mutate(formData)
  }

  const handleUpdate = () => {
    if (!editingChallenge) return
    updateMutation.mutate({
      id: editingChallenge.id,
      ...formData,
    })
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      deleteMutation.mutate(id)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.brief.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || challenge.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Challenges</h1>
          <p className="mt-1 text-muted-foreground">
            Create, edit, and manage innovation challenges
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
              <DialogDescription>
                Add a new innovation challenge. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Challenge title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brief">Brief *</Label>
                <Textarea
                  id="brief"
                  value={formData.brief}
                  onChange={(e) =>
                    setFormData({ ...formData, brief: e.target.value })
                  }
                  placeholder="Short description of the challenge"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rewards">Rewards *</Label>
                <Input
                  id="rewards"
                  value={formData.rewards}
                  onChange={(e) =>
                    setFormData({ ...formData, rewards: e.target.value })
                  }
                  placeholder="e.g., $5,000 prize pool"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'upcoming' | 'active' | 'ended') =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Challenge'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{challenges.length}</div>
            <p className="text-sm text-muted-foreground">Total Challenges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {challenges.filter((c) => c.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {challenges
                .reduce((acc, c) => acc + (c.participants || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Challenges Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallenges.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No challenges found
                  </TableCell>
                </TableRow>
              ) : (
                filteredChallenges.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {challenge.brief}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(challenge.status)}</TableCell>
                    <TableCell className="font-medium">
                      {challenge.rewards}
                    </TableCell>
                    <TableCell className="text-right">
                      {(challenge.participants || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(challenge)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            View Participants
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trophy className="mr-2 h-4 w-4" />
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(challenge.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Challenge</DialogTitle>
            <DialogDescription>
              Update challenge details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Challenge title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-brief">Brief *</Label>
              <Textarea
                id="edit-brief"
                value={formData.brief}
                onChange={(e) =>
                  setFormData({ ...formData, brief: e.target.value })
                }
                placeholder="Short description"
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Full Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rewards">Rewards *</Label>
              <Input
                id="edit-rewards"
                value={formData.rewards}
                onChange={(e) =>
                  setFormData({ ...formData, rewards: e.target.value })
                }
                placeholder="e.g., $5,000 prize pool"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'upcoming' | 'active' | 'ended') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
