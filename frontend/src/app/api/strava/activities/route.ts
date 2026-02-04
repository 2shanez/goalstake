import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function refreshToken(refreshToken: string) {
  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!tokenResponse.ok) {
    throw new Error('Failed to refresh token')
  }

  return await tokenResponse.json()
}

async function getValidAccessToken(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  let accessToken = cookieStore.get('strava_access_token')?.value
  const expiresAt = cookieStore.get('strava_expires_at')?.value
  const refreshTokenValue = cookieStore.get('strava_refresh_token')?.value

  if (!accessToken) {
    return { error: 'Not authenticated with Strava', status: 401 }
  }

  // Check if token is expired or will expire in the next 5 minutes
  const expiryTime = expiresAt ? parseInt(expiresAt) : 0
  const now = Math.floor(Date.now() / 1000)
  const bufferSeconds = 5 * 60

  // Token is still valid
  if (expiryTime === 0 || expiryTime >= now + bufferSeconds) {
    return { token: accessToken, cookiesToSet: null }
  }

  // Token expired or expiring soon - refresh it
  if (!refreshTokenValue) {
    return { error: 'Token expired and no refresh token available', status: 401 }
  }

  try {
    const tokenData = await refreshToken(refreshTokenValue)

    const cookiesToSet = [
      {
        name: 'strava_access_token',
        value: tokenData.access_token,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          maxAge: tokenData.expires_in || 21600,
        }
      },
      {
        name: 'strava_refresh_token',
        value: tokenData.refresh_token,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          maxAge: 60 * 60 * 24 * 30,
        }
      },
      {
        name: 'strava_expires_at',
        value: tokenData.expires_at.toString(),
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as const,
          maxAge: tokenData.expires_in || 21600,
        }
      }
    ]

    return { token: tokenData.access_token, cookiesToSet }
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return { error: 'Failed to refresh expired token', status: 401 }
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const tokenResult = await getValidAccessToken(cookieStore)

  if ('error' in tokenResult) {
    return NextResponse.json({ error: tokenResult.error }, { status: tokenResult.status })
  }

  const accessToken = tokenResult.token

  const searchParams = request.nextUrl.searchParams
  const after = searchParams.get('after') // Unix timestamp
  const before = searchParams.get('before') // Unix timestamp

  try {
    const url = new URL('https://www.strava.com/api/v3/athlete/activities')
    if (after) url.searchParams.set('after', after)
    if (before) url.searchParams.set('before', before)
    url.searchParams.set('per_page', '200')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token invalid' }, { status: 401 })
      }
      throw new Error('Failed to fetch activities')
    }

    const activities = await response.json()

    // Filter for runs and calculate total miles
    const runs = activities.filter((a: any) => a.type === 'Run')
    const totalMeters = runs.reduce((sum: number, a: any) => sum + a.distance, 0)
    const totalMiles = totalMeters / 1609.34

    const jsonResponse = NextResponse.json({
      activities: runs.map((a: any) => ({
        id: a.id,
        name: a.name,
        distance: a.distance,
        distanceMiles: a.distance / 1609.34,
        startDate: a.start_date,
        movingTime: a.moving_time,
      })),
      totalMiles: Math.round(totalMiles * 100) / 100,
      runCount: runs.length,
    })

    // Set updated cookies if token was refreshed
    if (tokenResult.cookiesToSet) {
      tokenResult.cookiesToSet.forEach(cookie => {
        jsonResponse.cookies.set(cookie.name, cookie.value, cookie.options)
      })
    }

    return jsonResponse
  } catch (error) {
    console.error('Strava activities error:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}
