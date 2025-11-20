-- Add new columns to threat_intel table for the enhanced schema
ALTER TABLE threat_intel ADD COLUMN IF NOT EXISTS threat_title text;
ALTER TABLE threat_intel ADD COLUMN IF NOT EXISTS platform text;
ALTER TABLE threat_intel ADD COLUMN IF NOT EXISTS status text;

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  rating integer not null,
  feedback_text text,
  created_at timestamp with time zone default now()
);

-- Enable RLS on feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for feedback
CREATE POLICY "Users can insert their own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create statistics table for community stats
CREATE TABLE IF NOT EXISTS community_stats (
  id uuid primary key default gen_random_uuid(),
  total_analyses integer default 0,
  total_threats integer default 0,
  most_common_threat text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on community_stats
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can view stats
CREATE POLICY "Anyone can view community stats"
  ON community_stats FOR SELECT
  USING (true);

-- Only admins can update stats
CREATE POLICY "Admins can update community stats"
  ON community_stats FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));