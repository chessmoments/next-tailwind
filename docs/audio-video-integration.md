# Audio & Video Integration Features

This document describes the enhanced audio and video integration features for chess video generation.

## Overview

Two major enhancements add professional broadcast quality to generated chess videos:

1. **Dynamic Sound Effects** - Contextual audio that reacts to game events
2. **B-Roll Media Integration** - Tournament footage and atmosphere clips

Both features are fully configurable and optional.

## 1. Dynamic Sound Effects System

### Features

The sound effects system automatically triggers sounds based on chess game events:

#### Sound Categories

1. **Piece Captures**
   - Different sounds for different piece values
   - Pawn: subtle click
   - Minor pieces: moderate thud
   - Rook: heavier sound
   - Queen: dramatic impact

2. **Crowd Reactions**
   - **Gasps**: Triggered on blunders (eval drop > 200 centipawns)
   - **Applause**: Brilliant moves (eval improvement > 150 centipawns)
   - **Murmurs**: Tense positions
   - **Cheers**: Checkmate

3. **Special Moves**
   - Check
   - Checkmate
   - Castling
   - Pawn promotion

4. **Atmosphere**
   - Tournament hall ambience (continuous)
   - Background piece movement sounds
   - Optional chess clock ticking

### Configuration

```typescript
import type { SoundEffectSettings } from '@/lib/sound-effects-config';

const soundSettings: SoundEffectSettings = {
  enabled: true,              // Master toggle
  capturesEnabled: true,       // Piece capture sounds
  crowdEnabled: true,          // Crowd reactions
  atmosphereEnabled: true,     // Background ambience
  clockEnabled: false,         // Clock ticking (off by default)
  specialMovesEnabled: true,   // Check, checkmate, etc.
  masterVolume: 1.0           // Global volume multiplier (0.0 - 1.0)
};
```

### Technical Implementation

#### Sound Triggering Logic

Located in `src/lib/sound-effect-triggers.ts`:

```typescript
// Analyze move and determine which sounds to trigger
const analysis: MoveAnalysis = {
  move: "Nf6",
  evaluation: 50,
  previousEvaluation: 250,  // Blunder! Eval drop of 200
  capturedPiece: undefined,
  isCheck: false,
  isCheckmate: false,
  // ...
};

const sounds = analyzeMoveForSounds(analysis, soundSettings);
// Returns: [gasp sound] due to large eval drop
```

#### Sound Scheduling

The system generates a complete sound schedule before rendering:

```typescript
const soundTriggers = generateSoundSchedule(
  moves,           // All game moves
  evaluations,     // Eval for each position
  soundSettings,   // Configuration
  fps              // Video frame rate
);

// Returns array of:
// [
//   { soundEffect, startFrame: 90, priority: 5 },
//   { soundEffect, startFrame: 120, priority: 3 },
//   ...
// ]
```

#### Overlap Prevention

Multiple sounds at the same moment are filtered by priority:

```typescript
const filtered = filterOverlappingSounds(
  soundTriggers,
  maxFrameDistance: 15  // Prevent sounds within 0.5 seconds
);
```

**Priority hierarchy:**
1. Special moves (check, checkmate) - 5
2. Crowd reactions - 4
3. Piece captures - 3
4. Clock sounds - 2
5. Atmosphere - 1

### Usage in Components

```tsx
import { SoundEffectLayer, AtmosphereSoundLayer } from '@/remotion/ChessGame/SoundEffectLayer';

<ChessGameWalkthrough
  pgn={pgn}
  gameInfo={gameInfo}
  soundEffects={{
    enabled: true,
    capturesEnabled: true,
    crowdEnabled: true,
    atmosphereEnabled: true,
    masterVolume: 0.8
  }}
/>
```

### Adding Custom Sounds

1. Add MP3 files to `/public/sounds/` following the directory structure
2. Update `src/lib/sound-effects-config.ts`:

```typescript
export const SOUND_EFFECTS = {
  piece_capture: [
    {
      id: 'capture-custom',
      category: 'piece_capture',
      path: 'sounds/pieces/my-custom-sound.mp3',
      volume: 0.4,
      description: 'My custom capture sound'
    }
  ]
};
```

## 2. B-Roll Media Integration

### Features

Professional video production elements:

#### Media Types

1. **Venue Establishing Shots**
   - Tournament hall exterior
   - Playing hall wide shots
   - Used in intro (first 3 seconds)
   - Creates broadcast TV feel

2. **Atmosphere Overlays**
   - Chess clock close-ups
   - Board overhead shots
   - Piece close-ups
   - Subtle overlays with blend modes

3. **Transition Clips**
   - Hand making moves
   - Clock button presses
   - Quick 1-2 second cuts between segments
   - Adds dynamic pacing

4. **Player Media** (Tournament-specific)
   - Player photos
   - Celebration clips
   - Picture-in-picture overlays

### Configuration

```typescript
import type { MediaLibrarySettings } from '@/lib/media-library-config';

const mediaSettings: MediaLibrarySettings = {
  enabled: true,              // Master toggle
  useVenueShots: true,        // Establishing shots in intro
  usePlayerMedia: true,       // Player photos/clips
  useAtmosphere: true,        // Atmosphere overlays
  useTransitions: true,       // Transition clips between moves
  preferUserUploads: true     // Prefer tournament-specific over stock
};
```

### Media Library Structure

```typescript
interface MediaAsset {
  id: string;
  type: 'video' | 'image';
  category: 'venue_exterior' | 'venue_hall' | 'player_photo' |
            'player_video' | 'atmosphere' | 'transition';
  path: string;                // Relative to /public/
  duration?: number;           // For videos (seconds)
  description: string;
  tags?: string[];
  tournamentId?: string;       // Links to specific tournament
  playerId?: string;           // Links to specific player
}
```

### Stock Media Library

Default stock footage is defined in `src/lib/media-library-config.ts`:

```typescript
export const DEFAULT_MEDIA_LIBRARY: MediaAsset[] = [
  {
    id: 'stock-venue-hall-01',
    type: 'video',
    category: 'venue_hall',
    path: 'media/stock/venue/hall-wide-01.mp4',
    duration: 5,
    description: 'Wide shot of chess tournament hall',
    tags: ['establishing', 'atmosphere']
  },
  // ... more stock assets
];
```

### Usage in Components

```tsx
import { VenueEstablishingShot, TransitionOverlay } from '@/remotion/ChessGame/MediaLayer';

<ChessGameWalkthrough
  pgn={pgn}
  gameInfo={gameInfo}
  mediaLibrary={{
    enabled: true,
    useVenueShots: true,
    useTransitions: true
  }}
/>
```

### Media Selection Logic

The system automatically selects appropriate media:

```typescript
const venueMedia = selectMediaForSegment(
  'intro',           // Segment type
  mediaSettings,     // Configuration
  tournamentId,      // Optional: prefer tournament-specific
  customLibrary      // Optional: custom media library
);

// Returns: MediaAsset or undefined
```

**Selection priority:**
1. Tournament-specific media (if `preferUserUploads: true`)
2. Stock footage matching category
3. Random selection if multiple matches

### Media Components

#### VenueEstablishingShot

Full-screen fade-in/out for intros:

```tsx
<VenueEstablishingShot
  media={venueMedia}
  durationInFrames={90}  // 3 seconds at 30fps
  startFrame={0}
/>
```

#### TransitionOverlay

Subtle overlays between game segments:

```tsx
<TransitionOverlay
  media={transitionMedia}
  startFrame={300}
  durationInFrames={45}  // 1.5 seconds
  // Rendered at 40% opacity by default
/>
```

#### AtmosphereOverlay

Continuous subtle background enhancement:

```tsx
<AtmosphereOverlay
  media={atmosphereMedia}
  startFrame={0}
  durationInFrames={600}
  blendMode="soft-light"  // CSS blend mode
/>
```

#### PlayerPictureInPicture

Corner overlays for player reactions:

```tsx
<PlayerPictureInPicture
  media={playerPhoto}
  startFrame={240}
  durationInFrames={120}  // 4 seconds
  position="bottom-right"
  size={240}  // pixels
/>
```

## Database Schema Extensions

### Tournament Media Table

```sql
CREATE TABLE tournament_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,

  media_type VARCHAR(10) CHECK (media_type IN ('video', 'image')),
  category VARCHAR(30) CHECK (category IN (
    'venue_exterior', 'venue_hall', 'player_photo',
    'player_video', 'atmosphere', 'transition'
  )),

  s3_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  duration INTEGER,  -- For videos, in seconds

  description TEXT,
  tags TEXT[],

  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  metadata JSONB DEFAULT '{}',

  CONSTRAINT require_tournament_or_player
    CHECK (tournament_id IS NOT NULL OR player_id IS NOT NULL)
);

CREATE INDEX idx_tournament_media_tournament ON tournament_media(tournament_id);
CREATE INDEX idx_tournament_media_player ON tournament_media(player_id);
CREATE INDEX idx_tournament_media_category ON tournament_media(category);
```

### Video Generation Props Extension

```sql
ALTER TABLE tournament_videos
ADD COLUMN sound_settings JSONB DEFAULT '{"enabled": true, "masterVolume": 1.0}',
ADD COLUMN media_settings JSONB DEFAULT '{"enabled": true}';
```

## API Endpoints

### Upload Tournament Media

```typescript
POST /api/tournaments/[id]/media/upload

Body: FormData
  - file: File
  - category: MediaCategory
  - description: string
  - playerId?: string
  - tags?: string[]

Response: MediaAsset
```

### List Tournament Media

```typescript
GET /api/tournaments/[id]/media

Query params:
  - category?: MediaCategory
  - playerId?: string

Response: MediaAsset[]
```

### Delete Media

```typescript
DELETE /api/tournaments/[id]/media/[mediaId]

Response: { success: boolean }
```

## UI Components

### Sound Effects Settings Panel

```tsx
<SoundEffectsSettings
  settings={soundSettings}
  onChange={setSoundSettings}
/>
```

Features:
- Master on/off toggle
- Individual category toggles
- Master volume slider
- Preview button for each sound

### Media Library Manager

```tsx
<MediaLibraryManager
  tournamentId={tournamentId}
  onUpload={handleUpload}
  onDelete={handleDelete}
/>
```

Features:
- Drag-and-drop upload
- Category organization
- Preview media files
- Tag management
- Stock footage browser

### Video Render Options

Extended modal includes:

```tsx
<RenderOptionsModal>
  {/* Existing options: music, orientation, etc. */}

  <SoundEffectsSection />
  <MediaLibrarySection />
</RenderOptionsModal>
```

## Performance Considerations

### Sound Effects

- **Memory**: Each sound effect is ~50-200KB
- **CPU**: Minimal - sounds are pre-scheduled
- **Render time**: No significant impact (<1% increase)

### B-Roll Media

- **Memory**: Videos can be 1-10MB each
- **CPU**: Moderate - video decoding during render
- **Render time**: +5-15% depending on number of clips
- **Best practices**:
  - Keep clips short (2-5 seconds)
  - Use 1080p max resolution
  - Limit to 3-5 clips per video

## Testing

### Sound Effects Testing

```bash
npm run test:sounds
```

Tests:
- Sound triggering logic
- Eval-based reactions
- Overlap prevention
- Volume normalization

### Media Integration Testing

```bash
npm run test:media
```

Tests:
- Media selection logic
- Fade transitions
- Timing calculations
- Blend modes

## Examples

### Full Integration Example

```tsx
<ChessGameWalkthrough
  pgn="1. e4 e5 2. Nf3 Nc6..."
  gameInfo={{
    white: "Player 1",
    black: "Player 2",
    result: "1-0",
    date: "2025-01-01"
  }}
  analysisResults={{
    moves: [
      { move: "e4", evaluation: 34 },
      { move: "e5", evaluation: -28 },
      // ...
    ]
  }}
  musicGenre="classical"
  soundEffects={{
    enabled: true,
    capturesEnabled: true,
    crowdEnabled: true,
    atmosphereEnabled: true,
    clockEnabled: false,
    specialMovesEnabled: true,
    masterVolume: 0.8
  }}
  mediaLibrary={{
    enabled: true,
    useVenueShots: true,
    usePlayerMedia: false,
    useAtmosphere: true,
    useTransitions: true,
    preferUserUploads: true
  }}
/>
```

## Future Enhancements

1. **AI-Generated Commentary Audio** (Text-to-speech)
2. **Dynamic Music** (Intensity varies with game tension)
3. **Player Interviews** (Audio clips at key moments)
4. **Multi-camera Angles** (Switch between board views)
5. **Live Commentary Integration** (Sync with streaming platforms)

## Resources

- Sound Effects Config: `src/lib/sound-effects-config.ts`
- Media Library Config: `src/lib/media-library-config.ts`
- Sound Triggers: `src/lib/sound-effect-triggers.ts`
- Media Components: `src/remotion/ChessGame/MediaLayer.tsx`
- Sound Components: `src/remotion/ChessGame/SoundEffectLayer.tsx`
