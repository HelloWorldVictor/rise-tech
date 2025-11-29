/**
 * Database Seed Script
 *
 * Creates initial admin user and sample data for development.
 * Run with: pnpm db:seed
 */

import 'dotenv/config'
import { db } from '../src/lib/db'
import { courses, challenges } from '../src/lib/schema'
import { registerUser } from '../src/lib/auth'

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  console.log('Creating admin user...')
  const adminUser = await registerUser({
    email: 'admin@risetech.dev',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  })
  console.log(`✅ Admin user created: ${adminUser.email}`)

  // Create sample courses
  console.log('Creating sample courses...')
  const sampleCourses = [
    {
      title: 'Web Development Fundamentals',
      description:
        'Learn the basics of HTML, CSS, and JavaScript to build modern web applications.',
      level: 'beginner',
      duration: '8 weeks',
      instructor: 'Sarah Johnson',
    },
    {
      title: 'React & TypeScript Mastery',
      description:
        'Deep dive into React with TypeScript for building scalable frontend applications.',
      level: 'intermediate',
      duration: '10 weeks',
      instructor: 'Michael Chen',
    },
    {
      title: 'Node.js Backend Development',
      description:
        'Build robust backend services with Node.js, Express, and PostgreSQL.',
      level: 'intermediate',
      duration: '10 weeks',
      instructor: 'David Kim',
    },
    {
      title: 'Full-Stack Engineering',
      description:
        'End-to-end application development combining frontend and backend skills.',
      level: 'advanced',
      duration: '16 weeks',
      instructor: 'Emma Wilson',
    },
  ]

  const insertedCourses = await db
    .insert(courses)
    .values(sampleCourses)
    .returning()
  console.log(`✅ Created ${insertedCourses.length} courses`)

  // Create sample challenges
  console.log('Creating sample challenges...')
  const sampleChallenges = [
    {
      title: 'Build a Personal Portfolio',
      brief:
        'Create a responsive portfolio website showcasing your projects and skills.',
      description:
        'Design and develop a personal portfolio that highlights your best work. Include sections for about, projects, skills, and contact information.',
      rewards: '$500 cash prize + mentorship session',
      status: 'active',
      participants: 45,
    },
    {
      title: 'Todo App with React',
      brief:
        'Build a fully functional todo application with React, including local storage persistence.',
      description:
        'Create a todo app with features like add, edit, delete, mark complete, and filter tasks. Use local storage for data persistence.',
      rewards: '$300 cash prize + course voucher',
      status: 'active',
      participants: 32,
    },
    {
      title: 'REST API Design',
      brief:
        'Design and implement a RESTful API for a blog platform with authentication.',
      description:
        'Build a complete REST API with user authentication, CRUD operations for posts and comments, and proper error handling.',
      rewards: '$750 cash prize + internship opportunity',
      status: 'upcoming',
      participants: 0,
    },
    {
      title: 'Real-time Chat Application',
      brief: 'Build a real-time chat application using WebSockets and React.',
      description:
        'Create a chat app with real-time messaging, user presence indicators, typing indicators, and message history.',
      rewards: '$1000 cash prize + job interview',
      status: 'upcoming',
      participants: 0,
    },
  ]

  const insertedChallenges = await db
    .insert(challenges)
    .values(sampleChallenges)
    .returning()
  console.log(`✅ Created ${insertedChallenges.length} challenges`)

  // Create a sample learner user
  console.log('Creating sample learner user...')
  const learnerUser = await registerUser({
    email: 'learner@example.com',
    password: 'learner123',
    name: 'Sample Learner',
    role: 'learner',
  })
  console.log(`✅ Learner user created: ${learnerUser.email}`)

  console.log('\n🎉 Seeding complete!')
  console.log('\nTest accounts:')
  console.log('  Admin: admin@risetech.dev / admin123')
  console.log('  Learner: learner@example.com / learner123')
}

seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
