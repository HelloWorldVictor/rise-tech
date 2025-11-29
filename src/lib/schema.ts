import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
  integer,
} from 'drizzle-orm/pg-core'

// Users table - stores learners, mentors, and admins
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('learner'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Sessions table - stores user sessions for authentication
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Courses table - stores course information
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  duration: varchar('duration', { length: 100 }),
  instructor: varchar('instructor', { length: 255 }),
  thumbnail: text('thumbnail'),
  modules: json('modules').$type<CourseModule[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Challenges table - stores innovation challenges
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  brief: text('brief').notNull(),
  description: text('description'),
  rewards: text('rewards').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('upcoming'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  participants: integer('participants').default(0),
  thumbnail: text('thumbnail'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Projects table - stores learner projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  tags: json('tags').$type<string[]>().notNull().default([]),
  images: json('images').$type<string[]>().notNull().default([]),
  demoUrl: text('demo_url'),
  repoUrl: text('repo_url'),
  challengeId: integer('challenge_id').references(() => challenges.id, {
    onDelete: 'set null',
  }),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Mentor assignments table - links mentors to learners
export const mentorAssignments = pgTable('mentor_assignments', {
  id: serial('id').primaryKey(),
  mentorId: integer('mentor_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  learnerId: integer('learner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Course enrollments table - tracks which users are enrolled in which courses
export const courseEnrollments = pgTable('course_enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  progress: integer('progress').default(0),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Project reviews table - stores mentor reviews for projects
export const projectReviews = pgTable('project_reviews', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  mentorId: integer('mentor_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  feedback: text('feedback').notNull(),
  rating: integer('rating'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type definitions for JSON columns
export interface CourseModule {
  id: string
  title: string
  lessons: CourseLesson[]
}

export interface CourseLesson {
  id: string
  title: string
  duration: string
  completed?: boolean
}

// Type exports for use in other files
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
export type Challenge = typeof challenges.$inferSelect
export type NewChallenge = typeof challenges.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type MentorAssignment = typeof mentorAssignments.$inferSelect
export type NewMentorAssignment = typeof mentorAssignments.$inferInsert
export type CourseEnrollment = typeof courseEnrollments.$inferSelect
export type NewCourseEnrollment = typeof courseEnrollments.$inferInsert
export type ProjectReview = typeof projectReviews.$inferSelect
export type NewProjectReview = typeof projectReviews.$inferInsert
