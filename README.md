# Rise Tech

A learning management platform for African tech talent, built with TanStack Start.

## Tech Stack

- **Framework:** TanStack Start + React
- **Database:** PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Cookie-based sessions

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Update DATABASE_URL in .env

# Initialize database
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

## Test Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | <admin@risetech.dev>     | admin123    |
| Learner | <learner@example.com>    | learner123  |
| Mentor  | <mentor@example.com>     | mentor123   |

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm db:studio    # Open database GUI
pnpm db:seed      # Seed sample data
```

## License

MIT
