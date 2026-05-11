'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const data = [
  { name: 'Mon', questions: 120, answered: 110 },
  { name: 'Tue', questions: 150, answered: 140 },
  { name: 'Wed', questions: 200, answered: 195 },
  { name: 'Thu', questions: 180, answered: 170 },
  { name: 'Fri', questions: 250, answered: 240 },
  { name: 'Sat', questions: 300, answered: 290 },
  { name: 'Sun', questions: 280, answered: 275 },
]

export default function DashboardCharts() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#888880" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888880" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111111', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#F0EDE6'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="questions" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorQuestions)" 
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="answered" 
            stroke="#00FF88" 
            fillOpacity={1} 
            fill="url(#colorAnswered)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
