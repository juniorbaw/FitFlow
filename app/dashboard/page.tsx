'use client'

import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { OverviewTab } from './components/tabs/OverviewTab'
import { LeadsTab } from './components/tabs/LeadsTab'
import { PostsTab } from './components/tabs/PostsTab'
import { RevenueTab } from './components/tabs/RevenueTab'

type TabType = 'overview' | 'leads' | 'posts' | 'revenue'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    { id: 'overview' as TabType, name: 'Vue d\'ensemble', component: OverviewTab },
    { id: 'leads' as TabType, name: 'Leads', component: LeadsTab },
    { id: 'posts' as TabType, name: 'Posts', component: PostsTab },
    { id: 'revenue' as TabType, name: 'Revenue', component: RevenueTab },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <TopBar title={tabs.find(t => t.id === activeTab)?.name || 'Dashboard'} />

        {/* Tabs */}
        <div className="border-b border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-8">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#FF5C00] text-white font-semibold'
                    : 'border-transparent text-[#888] hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
