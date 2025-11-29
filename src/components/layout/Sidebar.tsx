import { Link, useLocation } from '@tanstack/react-router'
import {
  BookOpen,
  GraduationCap,
  Home,
  Lightbulb,
  FolderOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import type { UserRole } from './types'

interface SidebarProps {
  open: boolean
  onClose: () => void
  role: UserRole
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const learnerNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: 'Challenges',
    href: '/challenges',
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    label: 'My Projects',
    href: '/projects',
    icon: <FolderOpen className="h-5 w-5" />,
  },
]

const mentorNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/mentor/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'My Learners',
    href: '/mentor/dashboard',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Reviews',
    href: '/mentor/dashboard',
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
]

const adminNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: 'Courses',
    href: '/admin/courses',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    label: 'Challenges',
    href: '/admin/challenges',
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    href: '/admin/dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: '/admin/dashboard',
    icon: <Settings className="h-5 w-5" />,
  },
]

export function Sidebar({ open, onClose, role }: SidebarProps) {
  const location = useLocation()

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'admin':
        return adminNavItems
      case 'mentor':
        return mentorNavItems
      case 'learner':
      default:
        return learnerNavItems
    }
  }

  const navItems = getNavItems()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col gap-2 p-4">
          <div className="flex items-center justify-between lg:hidden">
            <span className="text-sm font-medium text-muted-foreground">
              Navigation
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/dashboard' &&
                  item.href !== '/mentor/dashboard' &&
                  item.href !== '/admin/dashboard' &&
                  location.pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t pt-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Need help?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check our documentation or contact support.
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
