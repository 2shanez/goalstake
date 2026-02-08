import { NextRequest, NextResponse } from 'next/server'

// Verification endpoint for Chainlink Functions to call
// Checks if user maintained streak for the goal duration

const DUOLINGO_API = 'https://www.duolingo.com/2017-06-30/users'

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')
  const targetDays = request.nextUrl.searchParams.get('targetDays')
  
  if (!username || !targetDays) {
    return NextResponse.json(
      { error: 'Username and targetDays required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `${DUOLINGO_API}?username=${encodeURIComponent(username)}&fields=streak,streakData`,
      {
        headers: { 'User-Agent': 'Vaada/1.0' },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await response.json()
    
    if (!data.users || data.users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = data.users[0]
    const currentStreak = user.streak || 0
    const target = parseInt(targetDays)
    
    // User wins if their current streak >= target days
    const success = currentStreak >= target
    
    return NextResponse.json({
      username: user.username,
      currentStreak,
      targetDays: target,
      success,
      // Return 1 for success, 0 for failure (for Chainlink)
      result: success ? 1 : 0,
    })
  } catch (error) {
    console.error('Duolingo verify error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
