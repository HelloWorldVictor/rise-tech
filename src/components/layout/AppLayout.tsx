import { Outlet } from '@tanstack/react-router'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useState } from 'react'
import type { UserRole } from './types'

export { type UserRole } from './types'

interface AppLayoutProps {
  role?: UserRole
}

export function AppLayout({ role = 'learner' }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} role={role} />
      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          role={role}
        />
        <main className="flex-1 p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
