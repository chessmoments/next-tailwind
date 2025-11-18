-- Audio & Video Integration Features
-- Adds support for tournament media uploads and sound/media settings for videos

-- Tournament Media table
CREATE TABLE IF NOT EXISTS tournament_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player_fide_id TEXT, -- Optional: player-specific media

  -- Media file details
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')),
  category TEXT NOT NULL CHECK (category IN (
    'venue_exterior',
    'venue_hall',
    'player_photo',
    'player_video',
    'atmosphere',
    'transition'
  )),

  -- Storage
  s3_url TEXT NOT NULL,
  s3_bucket TEXT,
  s3_key TEXT,
  file_name TEXT NOT NULL,
  file_size INTEGER, -- bytes
  duration INTEGER, -- For videos: duration in seconds

  -- Metadata
  description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}',

  -- Upload tracking
  uploaded_by TEXT NOT NULL, -- user_id
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT require_tournament CHECK (tournament_id IS NOT NULL)
);

-- Indexes for tournament_media
CREATE INDEX idx_tournament_media_tournament ON tournament_media(tournament_id);
CREATE INDEX idx_tournament_media_player ON tournament_media(player_fide_id) WHERE player_fide_id IS NOT NULL;
CREATE INDEX idx_tournament_media_category ON tournament_media(category);
CREATE INDEX idx_tournament_media_uploaded_by ON tournament_media(uploaded_by);

-- Updated at trigger for tournament_media
CREATE OR REPLACE FUNCTION update_tournament_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tournament_media_updated_at
  BEFORE UPDATE ON tournament_media
  FOR EACH ROW
  EXECUTE FUNCTION update_tournament_media_updated_at();

-- Add sound and media settings to tournament_videos table
ALTER TABLE tournament_videos
ADD COLUMN IF NOT EXISTS sound_settings JSONB DEFAULT '{
  "enabled": true,
  "capturesEnabled": true,
  "crowdEnabled": true,
  "atmosphereEnabled": true,
  "clockEnabled": false,
  "specialMovesEnabled": true,
  "masterVolume": 1.0
}'::jsonb;

ALTER TABLE tournament_videos
ADD COLUMN IF NOT EXISTS media_settings JSONB DEFAULT '{
  "enabled": true,
  "useVenueShots": true,
  "usePlayerMedia": true,
  "useAtmosphere": true,
  "useTransitions": true,
  "preferUserUploads": true
}'::jsonb;

-- Comment on tables and columns
COMMENT ON TABLE tournament_media IS 'Stores uploaded media files (videos, images) for tournaments and players';
COMMENT ON COLUMN tournament_media.category IS 'Type of media: venue shots, player photos, atmosphere clips, or transitions';
COMMENT ON COLUMN tournament_media.duration IS 'Video duration in seconds (null for images)';
COMMENT ON COLUMN tournament_videos.sound_settings IS 'Sound effects configuration for video generation';
COMMENT ON COLUMN tournament_videos.media_settings IS 'B-roll media integration settings for video generation';
