# B-Roll Media Library

This directory contains video clips and images used as B-roll in chess videos.

## Directory Structure

```
media/
├── stock/                    # Stock footage (generic, reusable)
│   ├── venue/
│   │   ├── exterior-01.jpg   # Tournament hall exterior shots
│   │   ├── hall-wide-01.mp4  # Wide shots of playing hall
│   │   └── hall-wide-02.mp4
│   ├── atmosphere/
│   │   ├── clock-closeup.mp4       # Chess clock close-ups
│   │   ├── board-overhead.mp4      # Overhead board shots
│   │   └── pieces-closeup.mp4      # Artistic piece close-ups
│   └── transitions/
│       ├── hand-move.mp4           # Hand making a move
│       └── clock-press.mp4         # Hand pressing clock
└── tournaments/              # Tournament-specific media
    └── {tournament-id}/
        ├── venue/
        │   ├── exterior.jpg
        │   └── hall.mp4
        ├── players/
        │   └── {player-id}/
        │       ├── photo.jpg
        │       └── celebration.mp4
        └── atmosphere/
            └── crowd.mp4
```

## Media Specifications

### Video Files
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD) or higher
- **Frame Rate**: 30 fps or 60 fps
- **Duration**: 2-10 seconds per clip
- **Bitrate**: 5-10 Mbps

### Image Files
- **Format**: JPG or PNG
- **Resolution**: 1920x1080 or higher
- **File Size**: < 5 MB recommended

## Media Types & Usage

### 1. Venue Establishing Shots
**Used in**: Video intros (first 3 seconds)

- Exterior shots of tournament building
- Wide shots of playing hall
- Creates professional broadcast feel
- Helps viewers understand the setting

### 2. Atmosphere Clips
**Used in**: Throughout video as subtle overlays

- Chess clock ticking close-ups
- Overhead board shots
- Piece close-ups
- Blend mode: 20-30% opacity with soft-light blend

### 3. Transition Clips
**Used in**: Between major game segments (every 10 moves)

- Hand making a move
- Clock being pressed
- Quick 1-2 second cuts
- Adds dynamic pacing

### 4. Player Media (Tournament-Specific)
**Used in**: Picture-in-picture overlays

- Player photos
- Celebration clips
- Thinking/contemplation shots
- Displayed in corner during key moments

## Obtaining Stock Footage

### Free Stock Video Sites

1. **Pexels Videos** (https://www.pexels.com/videos/)
   - Free for commercial use
   - Search: "chess", "chess tournament", "chess board"

2. **Pixabay Videos** (https://pixabay.com/videos/)
   - Free under Pixabay License
   - Good selection of chess-related clips

3. **Videvo** (https://www.videvo.net/)
   - Mix of free and paid
   - Filter by "Free" and "No Attribution Required"

4. **Coverr** (https://coverr.co/)
   - Short, looping clips
   - Good for atmosphere shots

### Stock Photo Sites

1. **Unsplash** (https://unsplash.com/)
   - High-quality, free photos
   - Search: "chess tournament", "chess board"

2. **Pexels** (https://www.pexels.com/)
   - Free for commercial use

## Uploading Tournament Media

Tournament organizers can upload custom media through the UI:

1. Navigate to tournament settings
2. Click "Upload Media"
3. Select category (venue, player, atmosphere)
4. Upload files (max 50MB per file)
5. Add descriptions and tags

## Usage in Videos

Configure media settings in video props:

```typescript
{
  mediaLibrary: {
    enabled: true,
    useVenueShots: true,
    usePlayerMedia: true,
    useAtmosphere: true,
    useTransitions: true,
    preferUserUploads: true  // Prefer tournament-specific over stock
  }
}
```

## Media Integration Examples

### Intro Sequence
```
0-3s: Venue exterior fades in → dissolves to logo intro
```

### Mid-Game Transitions
```
Move 10: Quick hand-moving-piece clip (1.5s, 40% opacity)
Move 20: Clock press close-up (1.5s, 40% opacity)
```

### Player Reactions
```
After critical move: Player photo appears in bottom-right corner (4s)
```

## Creating Your Own B-Roll

If filming your own tournament footage:

1. **Venue Shots**: Arrive early, get wide establishing shots
2. **Player Footage**: Get permission, capture candid moments
3. **Atmosphere**: Clock close-ups, board angles, crowd shots
4. **Stabilization**: Use tripod or stabilizer
5. **Lighting**: Ensure good lighting, avoid harsh shadows
6. **Audio**: Can be disabled, but natural ambience is good

## License Requirements

- All media must be royalty-free or properly licensed
- Tournament-specific media requires consent from participants
- Stock footage must allow commercial use
- Attribute sources when required by license
