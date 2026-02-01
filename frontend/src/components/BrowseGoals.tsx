'use client'

import { GoalCard, Goal } from './GoalCard'

// Hardcoded goals for MVP - later these come from contract/admin
const FEATURED_GOALS: Goal[] = [
  {
    id: '1',
    title: 'February 50',
    description: 'Run 50 miles this month',
    emoji: '🏃',
    targetMiles: 50,
    durationDays: 28,
    minStake: 10,
    maxStake: 500,
    participants: 127,
    totalStaked: 8450,
    category: 'running',
  },
  {
    id: '2', 
    title: 'Weekly Warrior',
    description: 'Run 20 miles every week',
    emoji: '⚡',
    targetMiles: 20,
    durationDays: 7,
    minStake: 5,
    maxStake: 100,
    participants: 89,
    totalStaked: 2340,
    category: 'running',
  },
  {
    id: '3',
    title: 'Marathon Prep',
    description: 'Hit 100 miles in 30 days',
    emoji: '🏅',
    targetMiles: 100,
    durationDays: 30,
    minStake: 25,
    maxStake: 1000,
    participants: 43,
    totalStaked: 12750,
    category: 'running',
  },
  {
    id: '4',
    title: 'Starter Sprint',
    description: 'Run 10 miles this week',
    emoji: '👟',
    targetMiles: 10,
    durationDays: 7,
    minStake: 5,
    maxStake: 50,
    participants: 234,
    totalStaked: 3120,
    category: 'running',
  },
]

export function BrowseGoals() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {FEATURED_GOALS.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  )
}
