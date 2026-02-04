# Testing Strava Token Refresh

## Quick Test (Without Waiting 6 Hours)

### Method 1: Manual Cookie Manipulation
1. Start the dev server: `npm run dev`
2. Open browser DevTools → Application/Storage → Cookies
3. Connect your Strava account normally
4. Find the `strava_expires_at` cookie
5. Change its value to a timestamp in the past (e.g., `1704067200`)
6. Refresh the page
7. You should see "Refresh Strava Token" button appear
8. Click it and verify it updates the on-chain token

### Method 2: API Testing
```bash
# Get current token (should auto-refresh if expired)
curl http://localhost:3000/api/strava/token \
  -H "Cookie: strava_access_token=...; strava_refresh_token=...; strava_expires_at=1704067200"

# Force refresh
curl -X POST http://localhost:3000/api/strava/refresh \
  -H "Cookie: strava_refresh_token=..."

# Get token for on-chain update
curl http://localhost:3000/api/strava/update-onchain \
  -H "Cookie: strava_access_token=...; strava_refresh_token=...; strava_expires_at=..."
```

## E2E Test with Goal 8

Goal 8 was previously blocked due to expired tokens. Here's how to test it:

1. **Check Current Status**
   - Go to dashboard
   - Find Goal 8 in "My Goals"
   - Check if Strava is verified

2. **Refresh Token if Needed**
   - If you see "Refresh Strava Token" button, click it
   - Sign the transaction to update on-chain token
   - Wait for confirmation

3. **Wait for Chainlink Automation**
   - Goal deadline has passed
   - Chainlink Automation runs checkUpkeep every ~5 minutes
   - It should detect Goal 8 needs verification
   - Verification should now succeed with fresh token

4. **Verify Results**
   - Check if your miles were recorded
   - Check if goal shows as completed/verified
   - Try claiming reward if eligible

## What to Look For

### Success Indicators
- ✅ "Strava Verified" badge shows when token is fresh
- ✅ "Refresh Strava Token" shows when token needs updating
- ✅ Auto-refresh works in `/api/strava/activities`
- ✅ Auto-refresh works in `/api/strava/token`
- ✅ On-chain token updates successfully
- ✅ Chainlink verification succeeds with fresh token

### Failure Indicators
- ❌ 401 errors when fetching activities
- ❌ Token refresh returns error
- ❌ On-chain update transaction fails
- ❌ Chainlink verification still fails

## Debugging

### Check Token Status
```javascript
// In browser console
document.cookie.split('; ').filter(c => c.startsWith('strava_'))

// Check expiry
const expiresAt = parseInt(document.cookie.split('; ').find(c => c.startsWith('strava_expires_at='))?.split('=')[1])
const now = Math.floor(Date.now() / 1000)
console.log('Expires in', Math.floor((expiresAt - now) / 60), 'minutes')
```

### Check On-Chain Token
```bash
# Using cast (Foundry)
cast call 0xB10fCE97fc6eE84ff7772Bc44A651Dd076F7180D \
  "hasToken(address)(bool)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org

# Get stored token
cast call 0xB10fCE97fc6eE84ff7772Bc44A651Dd076F7180D \
  "stravaTokens(address)(string)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org
```

### Monitor Logs
```bash
# Frontend dev server
npm run dev

# Watch for errors
# - "Failed to refresh token"
# - "Token expired"
# - "No refresh token available"
```

## Next Steps After Testing

1. **If E2E works**: Goal 8 should verify successfully
2. **If claim works**: Test the full flow end-to-end
3. **Deploy to production**: Push to main branch → auto-deploys to Vercel
4. **Monitor**: Watch for token refresh issues in production

## Known Limitations

1. **Refresh token expiry**: After 30 days, user must reconnect Strava
2. **Manual on-chain updates**: Users must click "Refresh" button
3. **No notifications**: Users aren't notified when token expires
4. **No background refresh**: No cron job to auto-update on-chain tokens

These can be addressed in future iterations.
