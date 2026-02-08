import { NextRequest, NextResponse } from 'next/server'

// Withings OAuth 2.0 configuration
const WITHINGS_CLIENT_ID = process.env.WITHINGS_CLIENT_ID || ''
const WITHINGS_CLIENT_SECRET = process.env.WITHINGS_CLIENT_SECRET || ''
const WITHINGS_REDIRECT_URI = process.env.NEXT_PUBLIC_URL 
  ? `${process.env.NEXT_PUBLIC_URL}/api/withings/callback`
  : 'http://localhost:3000/api/withings/callback'

const WITHINGS_AUTH_URL = 'https://account.withings.com/oauth2_user/authorize2'
const WITHINGS_TOKEN_URL = 'https://wbsapi.withings.net/v2/oauth2'

// Scopes needed for weight data
const SCOPES = 'user.metrics'

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action')
  
  if (action === 'authorize') {
    // Generate authorization URL
    const state = Math.random().toString(36).substring(7)
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: WITHINGS_CLIENT_ID,
      redirect_uri: WITHINGS_REDIRECT_URI,
      scope: SCOPES,
      state,
    })
    
    const authUrl = `${WITHINGS_AUTH_URL}?${params.toString()}`
    
    return NextResponse.json({ authUrl, state })
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, refresh_token, action } = body
    
    if (action === 'token' && code) {
      // Exchange authorization code for tokens
      const params = new URLSearchParams({
        action: 'requesttoken',
        grant_type: 'authorization_code',
        client_id: WITHINGS_CLIENT_ID,
        client_secret: WITHINGS_CLIENT_SECRET,
        code,
        redirect_uri: WITHINGS_REDIRECT_URI,
      })
      
      const response = await fetch(WITHINGS_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      
      const data = await response.json()
      
      if (data.status !== 0) {
        return NextResponse.json({ error: data.error || 'Token exchange failed' }, { status: 400 })
      }
      
      return NextResponse.json({
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
        userid: data.body.userid,
      })
    }
    
    if (action === 'refresh' && refresh_token) {
      // Refresh access token
      const params = new URLSearchParams({
        action: 'requesttoken',
        grant_type: 'refresh_token',
        client_id: WITHINGS_CLIENT_ID,
        client_secret: WITHINGS_CLIENT_SECRET,
        refresh_token,
      })
      
      const response = await fetch(WITHINGS_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      
      const data = await response.json()
      
      if (data.status !== 0) {
        return NextResponse.json({ error: 'Token refresh failed' }, { status: 400 })
      }
      
      return NextResponse.json({
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Withings auth error:', error)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}
