import { createFileRoute, Outlet, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Home,
  GraduationCap,
  Lightbulb,
  BarChart3,
  Settings,
  Users,
  Menu,
  Bell,
  User,
  LogOut,
  X,
  Shield,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { getSession } from '@/server/auth'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session.authenticated) {
      throw redirect({ to: '/auth/login' })
    }
    if (session.user?.role !== 'admin') {
      // Redirect non-admins to their appropriate dashboard
      if (session.user?.role === 'mentor') {
        throw redirect({ to: '/mentor/dashboard' })
      }
      throw redirect({ to: '/dashboard' })
    }
    return { user: session.user }
  },
  component: AdminLayout,
})

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { label: 'Challenges', href: '/admin/challenges', icon: Lightbulb },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              R
            </div>
            <span className="hidden sm:inline-block">Rise Tech</span>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 text-xs sm:flex">
              <Shield className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Admin Console</span>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                2
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.name || 'Admin'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email || ''}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-sm font-medium text-muted-foreground">
                Admin Menu
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href + item.label}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    activeProps={{
                      className: 'bg-primary text-primary-foreground',
                    }}
                    activeOptions={{
                      exact: true,
                    }}
                    inactiveProps={{
                      className:
                        'text-muted-foreground hover:bg-muted hover:text-foreground',
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t pt-4">
              <div className="rounded-lg bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  <p className="text-sm font-medium text-destructive">
                    Admin Access
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have full administrative privileges.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
