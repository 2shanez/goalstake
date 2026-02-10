// Chainlink Functions: Strava Activity Verifier v2
// This version calls our backend API which handles token refresh
//
// Arguments passed from smart contract:
// args[0] = User wallet address
// args[1] = Start timestamp (challenge start)
// args[2] = End timestamp (challenge deadline)
// args[3] = API base URL (e.g., "https://vaada.io")

const userAddress = args[0];
const startTimestamp = args[1];
const endTimestamp = args[2];
const apiBaseUrl = args[3] || "https://vaada.io";

// Call our verification API
const verifyResponse = await Functions.makeHttpRequest({
  url: `${apiBaseUrl}/api/verify`,
  params: {
    user: userAddress,
    start: startTimestamp,
    end: endTimestamp
  }
});

if (verifyResponse.error) {
  throw new Error(`Verification API error: ${verifyResponse.error}`);
}

const data = verifyResponse.data;

if (!data.success) {
  throw new Error(`Verification failed: ${data.error || 'Unknown error'}`);
}

// Return miles in wei (1e18 = 1 mile)
// Our API already returns milesWei as a string
const milesWei = BigInt(data.milesWei || "0");

return Functions.encodeUint256(milesWei);
