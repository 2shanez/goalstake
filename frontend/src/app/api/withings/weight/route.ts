import { NextRequest, NextResponse } from 'next/server'

// Withings Measure API
const WITHINGS_MEASURE_URL = 'https://wbsapi.withings.net/measure'

interface WeightMeasurement {
  date: number // Unix timestamp
  weight: number // in kg
  weightLbs: number // in lbs
}

export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token')
  const startDate = request.nextUrl.searchParams.get('startdate') // Unix timestamp
  const endDate = request.nextUrl.searchParams.get('enddate') // Unix timestamp
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token required' }, { status: 400 })
  }

  try {
    const params = new URLSearchParams({
      action: 'getmeas',
      meastype: '1', // Weight
      category: '1', // Real measurements only (not user objectives)
    })
    
    if (startDate) params.append('startdate', startDate)
    if (endDate) params.append('enddate', endDate)
    
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
      return NextResponse.json(
        { error: data.error || 'Failed to fetch measurements' },
        { status: 400 }
      )
    }
    
    // Parse measurements
    const measurements: WeightMeasurement[] = []
    
    for (const grp of data.body.measuregrps || []) {
      for (const measure of grp.measures || []) {
        if (measure.type === 1) { // Weight
          // Weight is returned as value * 10^unit (e.g., 7500 with unit -2 = 75.00 kg)
          const weightKg = measure.value * Math.pow(10, measure.unit)
          measurements.push({
            date: grp.date,
            weight: weightKg,
            weightLbs: weightKg * 2.20462, // Convert to lbs
          })
        }
      }
    }
    
    // Sort by date descending (most recent first)
    measurements.sort((a, b) => b.date - a.date)
    
    return NextResponse.json({
      measurements,
      latestWeight: measurements[0] || null,
      oldestWeight: measurements[measurements.length - 1] || null,
    })
  } catch (error) {
    console.error('Withings weight error:', error)
    return NextResponse.json({ error: 'Failed to fetch weight' }, { status: 500 })
  }
}
