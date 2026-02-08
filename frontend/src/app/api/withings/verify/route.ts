import { NextRequest, NextResponse } from 'next/server'

// Verification endpoint for weight loss goals
// Checks if user lost target % of body weight

const WITHINGS_MEASURE_URL = 'https://wbsapi.withings.net/measure'

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token')
  const startWeight = request.nextUrl.searchParams.get('start_weight') // in kg
  const targetPercent = request.nextUrl.searchParams.get('target_percent')
  
  if (!accessToken || !startWeight || !targetPercent) {
    return NextResponse.json(
      { error: 'access_token, start_weight, and target_percent required' },
      { status: 400 }
    )
  }

  try {
    // Fetch latest weight measurement
    const params = new URLSearchParams({
      action: 'getmeas',
      meastype: '1', // Weight
      category: '1', // Real measurements
      lastupdate: '0', // Get all recent
    })
    
    const response = await fetch(WITHINGS_MEASURE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: params.toString(),
    })
    
    const data = await response.json()
    
    if (data.status !== 0) {
      return NextResponse.json({ error: 'Failed to fetch weight' }, { status: 400 })
    }
    
    // Find most recent weight measurement
    let latestWeightKg: number | null = null
    let latestDate: number | null = null
    
    for (const grp of data.body.measuregrps || []) {
      for (const measure of grp.measures || []) {
        if (measure.type === 1) {
          const weightKg = measure.value * Math.pow(10, measure.unit)
          if (!latestDate || grp.date > latestDate) {
            latestDate = grp.date
            latestWeightKg = weightKg
          }
        }
      }
    }
    
    if (latestWeightKg === null) {
      return NextResponse.json({ error: 'No weight measurements found' }, { status: 400 })
    }
    
    const startWeightKg = parseFloat(startWeight)
    const target = parseFloat(targetPercent)
    
    // Calculate weight loss percentage
    const weightLost = startWeightKg - latestWeightKg
    const percentLost = (weightLost / startWeightKg) * 100
    
    // Check if user achieved target
    const success = percentLost >= target
    
    return NextResponse.json({
      startWeightKg,
      currentWeightKg: latestWeightKg,
      weightLostKg: weightLost,
      percentLost: percentLost.toFixed(2),
      targetPercent: target,
      success,
      result: success ? 1 : 0,
    })
  } catch (error) {
    console.error('Withings verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
