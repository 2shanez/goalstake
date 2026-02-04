import { NextRequest, NextResponse } from 'next/server'

// Refreshes the Strava access token using the refresh token
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('strava_refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 401 })
  }

  try {
    // Exchange refresh token for new access token
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
      const error = await tokenResponse.json()
      console.error('Strava refresh error:', error)
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()

    // tokenData contains:
    // - access_token: string (new)
    // - refresh_token: string (new - Strava rotates refresh tokens)
    // - expires_at: number
    // - expires_in: number

    // Update cookies with new tokens
    const response = NextResponse.json({
      success: true,
      expires_at: tokenData.expires_at
    })

    response.cookies.set('strava_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 21600,
    })

    response.cookies.set('strava_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    response.cookies.set('strava_expires_at', tokenData.expires_at.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in || 21600,
    })

    return response
  } catch (error) {
    console.error('Strava token refresh error:', error)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}
