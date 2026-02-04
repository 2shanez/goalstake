import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const baseUrl = `${protocol}://${host}`

  const response = NextResponse.json({ success: true })

  // Clear all Strava cookies
  response.cookies.delete('strava_access_token')
  response.cookies.delete('strava_refresh_token')
  response.cookies.delete('strava_expires_at')
  response.cookies.delete('strava_athlete_id')

  return response
}
