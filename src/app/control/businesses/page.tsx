'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './page.module.css'

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setBusinesses([
      { id: '1', name: 'Selam Coffee Shop', phone: '0911000000', owner_username: 'abebe', created_at: '2025-05-01', stats: { convs: 42 }, is_active: true },
      { id: '2', name: 'Addis Clinic', phone: '0912000000', owner_username: 'sara', created_at: '2025-05-02', stats: { convs: 156 }, is_active: true },
      { id: '3', name: 'Bole Hotel', phone: '0913000000', owner_username: 'dawit', created_at: '2025-05-03', stats: { convs: 89 }, is_active: false },
    ])
    setLoading(false)
  }, [])

  const filtered = businesses.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.phone.includes(search) || 
    b.owner_username?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.adminPage}>
      <AdminSidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Businesses</h1>
            <p className="text-caption">Manage all registered businesses</p>
          </div>
          <div className={styles.headerActions}>
            <input 
              className="input" 
              placeholder="Search by name, phone, or username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        </header>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Registered</th>
                <th>Conversations</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className={styles.bizName}>{b.name}</div>
                    <div className="text-small">{b.phone}</div>
                  </td>
                  <td>
                    <div className={styles.owner}>@{b.owner_username}</div>
                  </td>
                  <td><div className="text-small">{new Date(b.created_at).toLocaleDateString()}</div></td>
                  <td><div className="text-body" style={{ fontWeight: 600 }}>{b.stats.convs}</div></td>
                  <td>
                    <span className={b.is_active ? 'badge-green' : 'badge-red'}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-ghost" style={{ fontSize: 12 }}>View</button>
                    <button className="btn-ghost" style={{ fontSize: 12, marginLeft: 8, color: b.is_active ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {b.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
