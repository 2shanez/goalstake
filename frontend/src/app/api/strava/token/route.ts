import { NextRequest, NextResponse } from 'next/server'

// Returns the Strava access token for on-chain storage
// ⚠️ TESTNET ONLY - In production, use Chainlink DON secrets
export async function GET(request: NextRequest) {
  const token = request.cookies.get('strava_access_token')?.value
  
  if (!token) {
    return NextResponse.json({ error: 'No Strava token found' }, { status: 401 })
  }
  
  return NextResponse.json({ token })
}
