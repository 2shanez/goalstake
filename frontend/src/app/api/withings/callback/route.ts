import { NextRequest, NextResponse } from 'next/server'

// Handle OAuth callback from Withings
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const error = request.nextUrl.searchParams.get('error')
  
  if (error) {
    // Redirect to app with error
    return NextResponse.redirect(
      new URL(`/?withings_error=${encodeURIComponent(error)}`, request.url)
    )
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL('/?withings_error=no_code', request.url)
    )
  }
  
  // Redirect back to app with code - frontend will exchange for token
  return NextResponse.redirect(
    new URL(`/?withings_code=${code}&withings_state=${state || ''}`, request.url)
  )
}
