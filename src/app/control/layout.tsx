import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function ControlLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('askmela_admin_token')

  // This check is server-side
  // We'll handle the path-based exclusion in the page level or middleware
  // For now, let's assume all sub-pages under /control require auth except /control itself

  return (
    <div style={{ display: 'flex' }}>
      {children}
    </div>
  )
}
