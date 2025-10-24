-- FundAI Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    goal DECIMAL(12, 2) NOT NULL,
    raised DECIMAL(12, 2) DEFAULT 0.0,
    category TEXT NOT NULL,
    duration INTEGER NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_name TEXT DEFAULT 'Anonymous',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward tiers table
CREATE TABLE IF NOT EXISTS reward_tiers (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL
);

-- Pledges table
CREATE TABLE IF NOT EXISTS pledges (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    stripe_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pledges_campaign ON pledges(campaign_id);
CREATE INDEX IF NOT EXISTS idx_pledges_user ON pledges(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_tiers_campaign ON reward_tiers(campaign_id);

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
CREATE POLICY "Campaigns are viewable by everyone" 
    ON campaigns FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can create campaigns" 
    ON campaigns FOR INSERT 
    WITH CHECK (auth.uid() = creator_id::uuid);

CREATE POLICY "Users can update their own campaigns" 
    ON campaigns FOR UPDATE 
    USING (auth.uid() = creator_id::uuid);

CREATE POLICY "Users can delete their own campaigns" 
    ON campaigns FOR DELETE 
    USING (auth.uid() = creator_id::uuid);

-- RLS Policies for reward_tiers
CREATE POLICY "Reward tiers are viewable by everyone" 
    ON reward_tiers FOR SELECT 
    USING (true);

CREATE POLICY "Campaign creators can manage reward tiers" 
    ON reward_tiers FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = reward_tiers.campaign_id 
            AND campaigns.creator_id::uuid = auth.uid()
        )
    );

-- RLS Policies for pledges
CREATE POLICY "Pledges are viewable by campaign creators and pledge owners" 
    ON pledges FOR SELECT 
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM campaigns 
            WHERE campaigns.id = pledges.campaign_id 
            AND campaigns.creator_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create pledges" 
    ON pledges FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create a function to update campaign raised amount (optional, can be done in backend)
CREATE OR REPLACE FUNCTION update_campaign_raised()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE campaigns
    SET raised = (
        SELECT COALESCE(SUM(amount), 0)
        FROM pledges
        WHERE campaign_id = NEW.campaign_id
    )
    WHERE id = NEW.campaign_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update campaign raised amount
DROP TRIGGER IF EXISTS trigger_update_campaign_raised ON pledges;
CREATE TRIGGER trigger_update_campaign_raised
    AFTER INSERT ON pledges
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_raised();

-- Insert sample data (optional - for testing)
-- Note: You'll need to replace the creator_id with an actual user ID from auth.users after signup

-- Sample campaigns (uncomment after creating a user)
-- INSERT INTO campaigns (id, title, description, goal, raised, category, duration, status, creator_id, creator_name, tags)
-- VALUES 
--     ('550e8400-e29b-41d4-a716-446655440001', 'The Last Ember: An Animated Short Film', 'A heartwarming story about hope and resilience told through beautiful animation.', 30000, 28511, 'Film & Video', 30, 'active', 'your-user-id-here', 'John Doe', ARRAY['animation', 'film', 'short-film']),
--     ('550e8400-e29b-41d4-a716-446655440002', 'Empower Tomorrow: Fund Essential Tech Education', 'Bringing technology education to underserved communities.', 6000, 0, 'Education', 45, 'active', 'your-user-id-here', 'Jane Smith', ARRAY['education', 'technology', 'community']);
