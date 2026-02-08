import { NextRequest, NextResponse } from 'next/server'

// Duolingo unofficial API endpoint
const DUOLINGO_API = 'https://www.duolingo.com/2017-06-30/users'

interface DuolingoUser {
  username: string
  streak: number
  totalXp: number
  currentCourseId: string
  courses: Array<{
    title: string
    xp: number
    crowns: number
  }>
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')
  
  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 })
  }

  try {
    // Fetch user profile from Duolingo
    const response = await fetch(
      `${DUOLINGO_API}?username=${encodeURIComponent(username)}&fields=streak,totalXp,currentCourseId,courses`,
      {
        headers: {
          'User-Agent': 'Vaada/1.0',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    )

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      throw new Error(`Duolingo API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.users || data.users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = data.users[0]
    
    const profile: DuolingoUser = {
      username: user.username,
      streak: user.streak || 0,
      totalXp: user.totalXp || 0,
      currentCourseId: user.currentCourseId || '',
      courses: (user.courses || []).map((c: any) => ({
        title: c.title,
        xp: c.xp,
        crowns: c.crowns,
      })),
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Duolingo API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Duolingo profile' },
      { status: 500 }
    )
  }
}
