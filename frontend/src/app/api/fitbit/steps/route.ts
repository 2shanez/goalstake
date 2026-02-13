import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

const FITBIT_CLIENT_ID = process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET

// Refresh Fitbit access token
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  const credentials = Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    console.error('Failed to refresh Fitbit token:', await response.text())
    return null
  }

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const wallet = searchParams.get('wallet')?.toLowerCase()
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const target = searchParams.get('target') // Target steps

  if (!wallet) {
    return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 })
  }

  try {
    // Get refresh token from Supabase
    const supabase = createServerSupabase()
    const { data: tokenData, error: dbError } = await supabase
      .from('fitbit_tokens')
      .select('refresh_token, user_id')
      .eq('wallet_address', wallet)
      .single()

    if (dbError || !tokenData) {
      return NextResponse.json({ 
        error: 'No Fitbit connection found for wallet',
        wallet,
      }, { status: 404 })
    }

    // Refresh access token
    const tokens = await refreshAccessToken(tokenData.refresh_token)
    if (!tokens) {
      return NextResponse.json({ error: 'Failed to refresh Fitbit token' }, { status: 401 })
    }

    // Update refresh token in database (Fitbit rotates them)
    await supabase
      .from('fitbit_tokens')
      .update({ 
        refresh_token: tokens.refreshToken,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', wallet)

    // Fetch steps for the date
    // Fitbit API: GET /1/user/-/activities/date/[date].json
    const activitiesUrl = `https://api.fitbit.com/1/user/-/activities/date/${date}.json`
    
    const response = await fetch(activitiesUrl, {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Fitbit API error:', errorText)
      return NextResponse.json({ error: 'Fitbit API error', details: errorText }, { status: 500 })
    }

    const data = await response.json()
    
    // Extract steps from summary
    const steps = data.summary?.steps || 0
    const targetNum = parseInt(target || '0', 10)
    const success = targetNum > 0 ? steps >= targetNum : undefined

    return NextResponse.json({
      wallet,
      date,
      steps,
      target: targetNum || undefined,
      success,
      fitbitUserId: tokenData.user_id,
      source: 'fitbit',
    })
  } catch (error) {
    console.error('Fitbit steps error:', error)
    return NextResponse.json({ error: 'Failed to fetch steps' }, { status: 500 })
  }
}
