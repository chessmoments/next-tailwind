# Sound Effects Library

This directory contains sound effects used in chess video generation.

## Directory Structure

```
sounds/
├── pieces/           # Chess piece capture sounds
│   ├── capture-pawn.mp3
│   ├── capture-minor.mp3
│   ├── capture-rook.mp3
│   └── capture-queen.mp3
├── crowd/            # Crowd reaction sounds
│   ├── gasp-01.mp3
│   ├── gasp-02.mp3
│   ├── applause-01.mp3
│   ├── applause-02.mp3
│   ├── murmur.mp3
│   └── cheer.mp3
├── atmosphere/       # Background ambience
│   ├── tournament-hall.mp3
│   └── pieces-background.mp3
├── clock/            # Chess clock sounds
│   ├── tick.mp3
│   ├── tick-fast.mp3
│   └── press.mp3
└── special/          # Special move sounds
    ├── check.mp3
    ├── checkmate.mp3
    ├── castle.mp3
    └── promotion.mp3
```

## Sound Specifications

- **Format**: MP3 (128-320 kbps)
- **Duration**: 1-3 seconds per sound effect
- **Sample Rate**: 44.1 kHz or 48 kHz
- **Channels**: Mono or Stereo
- **License**: Must be royalty-free or have appropriate license

## Obtaining Sound Effects

You can obtain royalty-free sound effects from:

1. **Freesound** (https://freesound.org/)
   - Search for "chess piece", "crowd gasp", "applause", etc.
   - Filter by Creative Commons licenses

2. **Zapsplat** (https://www.zapsplat.com/)
   - Free account required
   - Large library of sound effects

3. **BBC Sound Effects** (https://sound-effects.bbcrewind.co.uk/)
   - Free for personal, educational, and research use

4. **Pixabay** (https://pixabay.com/sound-effects/)
   - All sounds under Pixabay License (free for commercial use)

## Usage in Videos

Sound effects are automatically triggered based on game events:

- **Captures**: Triggered when a piece is captured (volume varies by piece value)
- **Crowd Reactions**: Triggered on large evaluation swings (blunders/brilliant moves)
- **Special Moves**: Check, checkmate, castling, promotion
- **Atmosphere**: Continuous background ambience throughout video

Configure sound settings in video props:

```typescript
{
  soundEffects: {
    enabled: true,
    capturesEnabled: true,
    crowdEnabled: true,
    atmosphereEnabled: true,
    clockEnabled: false,
    specialMovesEnabled: true,
    masterVolume: 1.0
  }
}
```

## Creating Your Own Sounds

If you want to record your own sounds:

1. Use Audacity (free audio editor)
2. Record at 48kHz, 16-bit
3. Keep sounds short (1-3 seconds)
4. Normalize audio levels
5. Export as MP3 (192 kbps or higher)
6. Name files according to the directory structure above
