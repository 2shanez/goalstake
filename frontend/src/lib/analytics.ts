import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

// Initialize Mixpanel
export const initAnalytics = () => {
  if (MIXPANEL_TOKEN && typeof window !== 'undefined') {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })
  }
}

// Identify user (call after login)
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return
  mixpanel.identify(userId)
  if (traits) {
    mixpanel.people.set(traits)
  }
}

// Track events
export const track = (event: string, properties?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return
  mixpanel.track(event, properties)
}

// Pre-defined events for Vaada
export const analytics = {
  // Auth
  walletConnected: (address: string) => 
    track('Wallet Connected', { address: address.slice(0, 10) }),
  
  // Fitness
  stravaConnected: () => track('Strava Connected'),
  fitbitConnected: () => track('Fitbit Connected'),
  
  // Goals
  goalViewed: (goalId: number, goalName: string) => 
    track('Goal Viewed', { goalId, goalName }),
  
  goalJoined: (goalId: number, goalName: string, stakeAmount: number) => 
    track('Goal Joined', { goalId, goalName, stakeAmount }),
  
  goalClaimed: (goalId: number, amount: number, won: boolean) => 
    track('Goal Claimed', { goalId, amount, won }),
  
  // Transactions
  approveStarted: (amount: number) => 
    track('Approve Started', { amount }),
  
  approveCompleted: (amount: number) => 
    track('Approve Completed', { amount }),
  
  joinStarted: (goalId: number, amount: number) => 
    track('Join Started', { goalId, amount }),
  
  joinCompleted: (goalId: number, amount: number) => 
    track('Join Completed', { goalId, amount }),
  
  // Errors
  transactionFailed: (action: string, error: string) => 
    track('Transaction Failed', { action, error }),
}
