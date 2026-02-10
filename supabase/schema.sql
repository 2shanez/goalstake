-- Vaada Database Schema
-- Run this in Supabase SQL Editor

-- Strava tokens table
CREATE TABLE IF NOT EXISTS strava_tokens (
  wallet_address TEXT PRIMARY KEY,
  athlete_id BIGINT NOT NULL,
  refresh_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_strava_tokens_athlete_id ON strava_tokens(athlete_id);

-- Enable Row Level Security (RLS)
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (our backend)
-- No client-side access allowed for security
CREATE POLICY "Service role only" ON strava_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

-- Optional: Add a function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER strava_tokens_updated_at
  BEFORE UPDATE ON strava_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
