import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

// Refresh Strava access token using stored refresh token
async function refreshStravaToken(refreshToken: string) {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error(`Strava token refresh failed: ${response.status}`)
  }

  return await response.json()
}

// Fetch activities from Strava
async function fetchStravaActivities(accessToken: string, after: number, before: number) {
  const url = new URL('https://www.strava.com/api/v3/athlete/activities')
  url.searchParams.set('after', after.toString())
  url.searchParams.set('before', before.toString())
  url.searchParams.set('per_page', '200')

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(`Strava API error: ${response.status}`)
  }

  return await response.json()
}

// Calculate total miles from running activities (device-recorded only)
function calculateMiles(activities: any[]): number {
  let totalMeters = 0

  for (const activity of activities) {
    // Only count runs that are device-recorded (not manual)
    if (activity.type === 'Run' && activity.manual === false) {
      totalMeters += activity.distance || 0
    }
  }

  // Convert meters to miles (1 mile = 1609.34 meters)
  return totalMeters / 1609.34
}

// Main verification endpoint - called by Chainlink Functions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('user')?.toLowerCase()
    const startTimestamp = searchParams.get('start')
    const endTimestamp = searchParams.get('end')

    // Validate parameters
    if (!walletAddress || !startTimestamp || !endTimestamp) {
      return NextResponse.json(
        { error: 'Missing required parameters: user, start, end' },
        { status: 400 }
      )
    }

    // Get refresh token from database
    const supabase = createServerSupabase()
    const { data: tokenData, error: dbError } = await supabase
      .from('strava_tokens')
      .select('refresh_token, athlete_id')
      .eq('wallet_address', walletAddress)
      .single()

    if (dbError || !tokenData) {
      return NextResponse.json(
        { error: 'No Strava token found for this wallet' },
        { status: 404 }
      )
    }

    // Refresh the access token
    const stravaTokens = await refreshStravaToken(tokenData.refresh_token)

    // Update refresh token in database (Strava rotates them)
    await supabase
      .from('strava_tokens')
      .update({
        refresh_token: stravaTokens.refresh_token,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)

    // Fetch activities from Strava
    const activities = await fetchStravaActivities(
      stravaTokens.access_token,
      parseInt(startTimestamp),
      parseInt(endTimestamp)
    )

    // Calculate total miles
    const miles = calculateMiles(activities)

    // Return miles with 18 decimals (matching contract's 1e18 = 1 mile)
    const milesWei = Math.floor(miles * 1e18).toString()

    return NextResponse.json({
      success: true,
      miles: miles,
      milesWei: milesWei,
      activitiesCount: activities.length,
      athleteId: tokenData.athlete_id,
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    )
  }
}
