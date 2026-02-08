// Chainlink Functions source for Withings weight loss verification
// Args: [accessToken, startWeightKg, targetPercent]
// Returns: 1 if weight loss >= target%, 0 otherwise

const accessToken = args[0]
const startWeightKg = parseFloat(args[1])
const targetPercent = parseFloat(args[2])

if (!accessToken || !startWeightKg || !targetPercent) {
  throw new Error('Missing accessToken, startWeightKg, or targetPercent')
}

// Fetch weight measurements from Withings API
const withingsResponse = await Functions.makeHttpRequest({
  url: 'https://wbsapi.withings.net/measure',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${accessToken}`,
  },
  data: 'action=getmeas&meastype=1&category=1',
})

if (withingsResponse.error) {
  throw new Error(`Withings API error: ${withingsResponse.error}`)
}

const data = withingsResponse.data
if (data.status !== 0) {
  throw new Error(`Withings error status: ${data.status}`)
}

// Find most recent weight measurement
let latestWeightKg = null
let latestDate = null

for (const grp of data.body.measuregrps || []) {
  for (const measure of grp.measures || []) {
    if (measure.type === 1) { // Weight type
      const weightKg = measure.value * Math.pow(10, measure.unit)
      if (!latestDate || grp.date > latestDate) {
        latestDate = grp.date
        latestWeightKg = weightKg
      }
    }
  }
}

if (latestWeightKg === null) {
  throw new Error('No weight measurements found')
}

// Calculate weight loss percentage
const weightLost = startWeightKg - latestWeightKg
const percentLost = (weightLost / startWeightKg) * 100

// Check if user achieved target
const success = percentLost >= targetPercent

console.log(`Start: ${startWeightKg}kg, Current: ${latestWeightKg}kg, Lost: ${percentLost.toFixed(2)}%, Target: ${targetPercent}%, Success: ${success}`)

// Return 1 for success, 0 for failure
return Functions.encodeUint256(success ? 1 : 0)
