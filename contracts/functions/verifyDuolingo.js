// Chainlink Functions source for Duolingo streak verification
// Args: [username, targetDays]
// Returns: 1 if streak >= target, 0 otherwise

const username = args[0]
const targetDays = parseInt(args[1])

if (!username || !targetDays) {
  throw new Error('Missing username or targetDays')
}

// Fetch user profile from Duolingo API
const duolingoResponse = await Functions.makeHttpRequest({
  url: `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}&fields=streak`,
  headers: {
    'User-Agent': 'Vaada-Chainlink/1.0',
  },
})

if (duolingoResponse.error) {
  throw new Error(`Duolingo API error: ${duolingoResponse.error}`)
}

const data = duolingoResponse.data
if (!data.users || data.users.length === 0) {
  throw new Error('Duolingo user not found')
}

const user = data.users[0]
const currentStreak = user.streak || 0

// Check if user maintained streak for target days
// Note: Duolingo streak is current consecutive days, not historical
// For "30 day streak" goal, user must have streak >= 30 at verification time
const success = currentStreak >= targetDays

console.log(`User: ${username}, Streak: ${currentStreak}, Target: ${targetDays}, Success: ${success}`)

// Return 1 for success, 0 for failure
return Functions.encodeUint256(success ? 1 : 0)
