import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Clock,
  Users,
  Trophy,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  Award,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_learner/challenges/$challengeId')({
  component: ChallengeDetailPage,
})

function ChallengeDetailPage() {
  const { challengeId } = Route.useParams()

  // Placeholder data
  const challenge = {
    id: challengeId,
    title: 'Build a FinTech Solution for SMEs',
    description:
      'Create an innovative financial technology solution to help small and medium enterprises in Africa manage their finances better. Your solution should address key pain points such as access to capital, payment processing, and financial record keeping.',
    reward: '$5,000',
    deadline: 'December 15, 2024',
    daysLeft: 14,
    participants: 156,
    difficulty: 'Intermediate',
    category: 'FinTech',
    status: 'active',
    sponsor: 'African Development Bank',
    startDate: 'November 1, 2024',
    hasSubmitted: false,
    brief: `
## Challenge Overview

Small and Medium Enterprises (SMEs) are the backbone of African economies, yet many struggle with basic financial management. This challenge invites you to build an innovative solution that addresses one or more of the following problems:

### Problem Areas

1. **Access to Capital**: Many SMEs lack access to traditional banking and financing options
2. **Payment Processing**: Accepting and managing payments remains challenging for small businesses
3. **Financial Record Keeping**: Most SMEs lack proper bookkeeping systems
4. **Cash Flow Management**: Understanding and predicting cash flow is a major challenge

### Requirements

Your solution should:
- Be accessible on mobile devices (most African entrepreneurs use smartphones)
- Work in low-connectivity environments
- Support multiple local languages
- Have a user-friendly interface suitable for users with varying tech literacy
- Include basic financial reporting features

### Evaluation Criteria

- **Innovation (30%)**: How creative and unique is your solution?
- **Impact (25%)**: What potential impact could your solution have?
- **Technical Implementation (25%)**: How well is the solution built?
- **User Experience (20%)**: How easy is it for users to adopt and use?
    `,
    rewards: [
      {
        position: '1st Place',
        amount: '$5,000',
        perks: ['Mentorship program', 'Investor introductions'],
      },
      {
        position: '2nd Place',
        amount: '$2,500',
        perks: ['Mentorship program'],
      },
      { position: '3rd Place', amount: '$1,000', perks: ['Certificate'] },
    ],
    timeline: [
      { date: 'Nov 1, 2024', event: 'Challenge Opens', completed: true },
      { date: 'Nov 15, 2024', event: 'Midway Check-in', completed: true },
      { date: 'Dec 1, 2024', event: 'Final Week Begins', completed: false },
      { date: 'Dec 15, 2024', event: 'Submissions Due', completed: false },
      { date: 'Dec 22, 2024', event: 'Winners Announced', completed: false },
    ],
    judges: [
      { name: 'Dr. Aisha Mwangi', role: 'CEO, AfriPay', avatar: '' },
      { name: 'James Okonkwo', role: 'Investment Director, ADB', avatar: '' },
      { name: 'Sarah Banda', role: 'Tech Lead, M-Pesa', avatar: '' },
    ],
    faq: [
      {
        question: 'Can I participate as a team?',
        answer: 'Yes, teams of up to 4 members are allowed.',
      },
      {
        question: 'Do I need to build a complete product?',
        answer:
          'A working prototype or MVP is sufficient. We value the concept and potential.',
      },
      {
        question: 'What technologies can I use?',
        answer:
          'Any technology stack is acceptable. Choose what best suits your solution.',
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/challenges">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Link>
      </Button>

      {/* Challenge Header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-500">Active</Badge>
              <Badge variant="secondary">{challenge.category}</Badge>
              <Badge variant="outline">{challenge.difficulty}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <p className="text-muted-foreground">{challenge.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {challenge.participants} participants
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <Clock className="h-4 w-4" />
                {challenge.daysLeft} days left
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Ends {challenge.deadline}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Sponsored by
              </span>
              <span className="font-medium">{challenge.sponsor}</span>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <Card className="h-fit">
          <CardHeader>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-3xl font-bold">{challenge.reward}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Grand Prize</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenge.hasSubmitted ? (
              <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                <p className="mt-2 font-medium text-green-700 dark:text-green-400">
                  Submission Received
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Good luck!
                </p>
              </div>
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link to="/projects/new">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Project
                </Link>
              </Button>
            )}
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{challenge.startDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">{challenge.deadline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium">{challenge.difficulty}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Content Tabs */}
      <Tabs defaultValue="brief" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brief">Brief</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="brief" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Challenge Brief
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {challenge.brief}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Judges</CardTitle>
              <CardDescription>
                Meet the experts who will evaluate your submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {challenge.judges.map((judge, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div>
                      <p className="font-medium">{judge.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {judge.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {challenge.rewards.map((reward, index) => (
              <Card
                key={index}
                className={index === 0 ? 'border-yellow-500 border-2' : ''}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Award
                      className={`h-8 w-8 ${
                        index === 0
                          ? 'text-yellow-500'
                          : index === 1
                            ? 'text-gray-400'
                            : 'text-amber-600'
                      }`}
                    />
                  </div>
                  <CardTitle>{reward.position}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-foreground">
                    {reward.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reward.perks.map((perk, perkIndex) => (
                      <li
                        key={perkIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6">
                {challenge.timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full ${
                        item.completed
                          ? 'bg-green-500'
                          : 'border-2 border-muted-foreground bg-background'
                      }`}
                    >
                      {item.completed && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {index < challenge.timeline.length - 1 && (
                      <div
                        className={`absolute -left-4 top-4 h-full w-0.5 ${
                          item.completed ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {challenge.faq.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{item.question}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.answer}
                    </p>
                    {index < challenge.faq.length - 1 && <Separator />}
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
