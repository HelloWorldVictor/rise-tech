import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Filter, Clock, Trophy, Users, Lightbulb } from 'lucide-react'
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

export const Route = createFileRoute('/_learner/challenges/')({
  component: ChallengesPage,
})

function ChallengesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Placeholder data
  const challenges = [
    {
      id: '1',
      title: 'Build a FinTech Solution for SMEs',
      description:
        'Create an innovative financial technology solution to help small and medium enterprises in Africa manage their finances better.',
      reward: '$5,000',
      deadline: '2024-12-15',
      daysLeft: 14,
      participants: 156,
      difficulty: 'Intermediate',
      category: 'FinTech',
      status: 'active',
      sponsor: 'African Development Bank',
    },
    {
      id: '2',
      title: 'AgriTech Innovation Challenge',
      description:
        'Develop a technology solution to help farmers increase productivity and access markets more efficiently.',
      reward: '$3,000',
      deadline: '2024-12-22',
      daysLeft: 21,
      participants: 89,
      difficulty: 'Beginner',
      category: 'AgriTech',
      status: 'active',
      sponsor: 'Farm Africa',
    },
    {
      id: '3',
      title: 'HealthTech for Rural Communities',
      description:
        'Build a healthcare solution that addresses the unique challenges faced by rural communities in accessing quality healthcare.',
      reward: '$4,000',
      deadline: '2025-01-05',
      daysLeft: 35,
      participants: 67,
      difficulty: 'Advanced',
      category: 'HealthTech',
      status: 'active',
      sponsor: 'Gates Foundation',
    },
    {
      id: '4',
      title: 'EdTech Platform Challenge',
      description:
        'Create an educational technology platform that makes learning more accessible and engaging for African students.',
      reward: '$2,500',
      deadline: '2024-11-30',
      daysLeft: 0,
      participants: 234,
      difficulty: 'Intermediate',
      category: 'EdTech',
      status: 'ended',
      sponsor: 'UNESCO Africa',
    },
    {
      id: '5',
      title: 'Clean Energy Solutions',
      description:
        'Develop innovative clean energy solutions for off-grid communities across Africa.',
      reward: '$6,000',
      deadline: '2025-01-20',
      daysLeft: 50,
      participants: 45,
      difficulty: 'Advanced',
      category: 'CleanTech',
      status: 'active',
      sponsor: 'Solar Africa Initiative',
    },
    {
      id: '6',
      title: 'E-Commerce for Local Artisans',
      description:
        'Build a platform that helps local artisans sell their products to a global market.',
      reward: '$2,000',
      deadline: '2025-02-01',
      daysLeft: 62,
      participants: 78,
      difficulty: 'Beginner',
      category: 'E-Commerce',
      status: 'upcoming',
      sponsor: 'AfriCraft Network',
    },
  ]

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || challenge.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Innovation Challenges</h1>
        <p className="mt-1 text-muted-foreground">
          Solve real-world problems and win rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {challenges.filter((c) => c.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Challenges</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">$22,500</p>
              <p className="text-sm text-muted-foreground">Total Rewards</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">669</p>
              <p className="text-sm text-muted-foreground">Participants</p>
            </div>
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

      {/* Challenge Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-2">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription>by {challenge.sponsor}</CardDescription>
                  </div>
                  {getStatusBadge(challenge.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {challenge.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(challenge.difficulty)}
                  >
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="secondary">{challenge.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t pt-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-foreground">
                        {challenge.reward}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {challenge.participants}
                    </div>
                  </div>
                  {challenge.status === 'active' && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-orange-500">
                        {challenge.daysLeft} days left
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full"
                  variant={
                    challenge.status === 'ended' ? 'secondary' : 'default'
                  }
                  disabled={challenge.status === 'ended'}
                  asChild
                >
                  <Link
                    to="/challenges/$challengeId"
                    params={{ challengeId: challenge.id }}
                  >
                    {challenge.status === 'ended'
                      ? 'View Results'
                      : 'View Challenge'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="search"
          title="No challenges found"
          description="Try adjusting your search or filter criteria"
          action={{
            label: 'Clear filters',
            onClick: () => {
              setSearchQuery('')
              setStatusFilter('all')
            },
          }}
        />
      )}
    </div>
  )
}
