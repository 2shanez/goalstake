# Strava Token Auto-Refresh Implementation

## Problem
Strava access tokens expire after ~6 hours. When Chainlink Functions tries to verify a goal after the token expires, the verification fails.

## Solution
Implemented a comprehensive token refresh mechanism that:
1. Automatically refreshes tokens using Strava's refresh_token
2. Updates cookies with new tokens
3. Detects when on-chain tokens need refreshing
4. Provides UI for users to update expired on-chain tokens

## What Was Changed

### 1. Updated Callback (`/api/strava/callback/route.ts`)
- Now stores `expires_at` timestamp in a cookie
- This allows us to check if a token is expired without making API calls

### 2. New Refresh Endpoint (`/api/strava/refresh/route.ts`)
- POST endpoint that exchanges refresh_token for new access_token
- Updates all token cookies (access_token, refresh_token, expires_at)
- Note: Strava rotates refresh tokens, so we store the new one

### 3. Updated Token Endpoint (`/api/strava/token/route.ts`)
- Checks if token is expired or expiring soon (5-minute buffer)
- Automatically refreshes token if needed before returning it
- Used by StravaConnect component when storing tokens on-chain

### 4. Updated Activities Endpoint (`/api/strava/activities/route.ts`)
- Includes auto-refresh logic before fetching activities
- Prevents 401 errors from expired tokens

### 5. New Update On-Chain Endpoint (`/api/strava/update-onchain/route.ts`)
- Specialized endpoint for getting fresh tokens for on-chain updates
- Uses 1-hour buffer (longer than standard 5-minute buffer)
- Returns metadata about whether token was refreshed

### 6. Updated StravaConnect Component (`/components/StravaConnect.tsx`)
- Checks token expiry every 5 minutes
- Shows "Refresh Strava Token" button when token needs updating
- Automatically uses fresh tokens when storing on-chain
- Handles both initial token storage and on-chain token updates

## How It Works

### Flow for New Users
1. User clicks "Connect Strava"
2. OAuth flow completes → stores access_token, refresh_token, expires_at in cookies
3. User clicks "Verify Strava" → stores fresh token on-chain
4. Token is valid for ~6 hours

### Flow for Existing Users with Expired Tokens
1. Component checks token expiry every 5 minutes
2. If token expires in < 1 hour, shows "Refresh Strava Token" button
3. User clicks refresh → fetches fresh token from `/api/strava/update-onchain`
4. Fresh token is stored on-chain via `storeToken()` contract call
5. Chainlink Functions can now verify using the updated token

### Auto-Refresh in API Calls
- All API endpoints check token expiry before use
- If expired or expiring soon, automatically refreshes
- Seamless for the user - no manual intervention needed for API calls

## Token Lifetimes
- **Access Token**: 6 hours (from Strava)
- **Refresh Token**: 30 days (stored in cookie)
- **Expires At**: Stored as Unix timestamp for checking expiry

## Buffer Times
- **Standard API calls**: 5-minute buffer before expiry
- **On-chain updates**: 1-hour buffer (more conservative)

## Security Notes
- All tokens stored in httpOnly cookies (not accessible to JS)
- refresh_token has 30-day expiry in cookie
- Tokens are only exposed via secure API endpoints
- ⚠️ Current implementation stores tokens in cookies - for production, consider encrypting or using DON secrets

## Testing

### Test Token Refresh
1. Connect Strava account
2. Wait 6+ hours (or manually set expires_at to past time in browser devtools)
3. Component should show "Refresh Strava Token" button
4. Click refresh → should update on-chain token

### Test Auto-Refresh in API Calls
1. Make API call to `/api/strava/activities` with expired token
2. Should automatically refresh and return activities (no error)

### Test E2E Verification
1. Create a goal
2. Join the goal
3. Complete runs on Strava
4. Wait for deadline
5. Chainlink Automation should verify using fresh token

## Future Improvements
1. **Automatic On-Chain Updates**: Background job to refresh on-chain tokens before expiry
2. **Token Expiry Notifications**: Email/push notifications when token needs refresh
3. **Refresh Token Rotation**: Handle refresh_token expiry (currently 30 days)
4. **DON Secrets**: Move to Chainlink DON secrets for production security
5. **Multi-User Management**: Admin dashboard to monitor token status for all users
