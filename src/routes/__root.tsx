import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Home, ArrowLeft, Search } from 'lucide-react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { AuthProvider } from '@/lib/auth-context'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Rise Tech - Empowering Africa's Next Tech Leaders",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="relative mx-auto mb-8 h-40 w-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-bold text-primary/20">404</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-20 w-20 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Page Not Found
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 border-t pt-8">
              <p className="text-sm text-muted-foreground">
                Here are some helpful links:
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/courses"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Browse Courses
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  to="/challenges"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Challenges
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
