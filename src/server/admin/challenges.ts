import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { challenges } from '@/lib/schema'
import { requireAdminFromCookie } from '@/lib/serverHelpers'

interface CreateChallengeInput {
  title: string
  brief: string
  description?: string
  rewards: string
  status?: 'upcoming' | 'active' | 'ended'
  startDate?: Date
  endDate?: Date
  thumbnail?: string
}

interface UpdateChallengeInput {
  id: number
  title?: string
  brief?: string
  description?: string
  rewards?: string
  status?: 'upcoming' | 'active' | 'ended'
  startDate?: Date
  endDate?: Date
  participants?: number
  thumbnail?: string
}

// Get all challenges (public)
export const getChallenges = createServerFn({ method: 'GET' }).handler(
  async () => {
    const allChallenges = await db
      .select()
      .from(challenges)
      .orderBy(challenges.createdAt)

    return {
      success: true,
      challenges: allChallenges,
    }
  },
)

// Get a single challenge by ID (public)
export const getChallenge = createServerFn({ method: 'GET' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid challenge ID is required')
    }
    return id
  })
  .handler(async ({ data: challengeId }) => {
    const result = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1)

    const challenge = result[0]

    if (!challenge) {
      throw new Error('Challenge not found')
    }

    return {
      success: true,
      challenge,
    }
  })

// Create a new challenge (admin only)
export const createChallenge = createServerFn({ method: 'POST' })
  .inputValidator((input: CreateChallengeInput) => {
    if (!input.title || !input.brief || !input.rewards) {
      throw new Error('Title, brief, and rewards are required')
    }

    if (input.title.length < 3) {
      throw new Error('Title must be at least 3 characters long')
    }

    if (input.brief.length < 10) {
      throw new Error('Brief must be at least 10 characters long')
    }

    return input
  })
  .handler(async ({ data }) => {
    await requireAdminFromCookie()

    const result = await db
      .insert(challenges)
      .values({
        title: data.title,
        brief: data.brief,
        description: data.description,
        rewards: data.rewards,
        status: data.status || 'upcoming',
        startDate: data.startDate,
        endDate: data.endDate,
        thumbnail: data.thumbnail,
        participants: 0,
      })
      .returning()

    return {
      success: true,
      challenge: result[0],
    }
  })

// Update a challenge (admin only)
export const updateChallenge = createServerFn({ method: 'POST' })
  .inputValidator((input: UpdateChallengeInput) => {
    if (!input.id) {
      throw new Error('Challenge ID is required')
    }
    return input
  })
  .handler(async ({ data }) => {
    await requireAdminFromCookie()

    // Check if challenge exists
    const existing = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, data.id))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Challenge not found')
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (data.title) updateData.title = data.title
    if (data.brief) updateData.brief = data.brief
    if (data.description !== undefined)
      updateData.description = data.description
    if (data.rewards) updateData.rewards = data.rewards
    if (data.status) updateData.status = data.status
    if (data.startDate !== undefined) updateData.startDate = data.startDate
    if (data.endDate !== undefined) updateData.endDate = data.endDate
    if (data.participants !== undefined)
      updateData.participants = data.participants
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail

    const result = await db
      .update(challenges)
      .set(updateData)
      .where(eq(challenges.id, data.id))
      .returning()

    return {
      success: true,
      challenge: result[0],
    }
  })

// Delete a challenge (admin only)
export const deleteChallenge = createServerFn({ method: 'POST' })
  .inputValidator((id: number) => {
    if (!id || typeof id !== 'number') {
      throw new Error('Valid challenge ID is required')
    }
    return id
  })
  .handler(async ({ data: challengeId }) => {
    await requireAdminFromCookie()

    // Check if challenge exists
    const existing = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, challengeId))
      .limit(1)

    if (!existing[0]) {
      throw new Error('Challenge not found')
    }

    await db.delete(challenges).where(eq(challenges.id, challengeId))

    return {
      success: true,
      message: 'Challenge deleted successfully',
    }
  })
