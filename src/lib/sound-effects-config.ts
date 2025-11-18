/**
 * Sound Effects Configuration for Chess Videos
 * Provides contextual audio that reacts to game events
 */

export type SoundEffectCategory =
  | 'piece_capture'
  | 'crowd_reaction'
  | 'atmosphere'
  | 'clock'
  | 'special_moves';

export interface SoundEffect {
  id: string;
  category: SoundEffectCategory;
  path: string;
  volume?: number;
  description: string;
}

/**
 * Sound effects library organized by category
 */
export const SOUND_EFFECTS: Record<SoundEffectCategory, SoundEffect[]> = {
  piece_capture: [
    {
      id: 'capture-pawn',
      category: 'piece_capture',
      path: 'sounds/pieces/capture-pawn.mp3',
      volume: 0.4,
      description: 'Pawn capture sound'
    },
    {
      id: 'capture-minor',
      category: 'piece_capture',
      path: 'sounds/pieces/capture-minor.mp3',
      volume: 0.45,
      description: 'Knight/Bishop capture sound'
    },
    {
      id: 'capture-rook',
      category: 'piece_capture',
      path: 'sounds/pieces/capture-rook.mp3',
      volume: 0.5,
      description: 'Rook capture sound'
    },
    {
      id: 'capture-queen',
      category: 'piece_capture',
      path: 'sounds/pieces/capture-queen.mp3',
      volume: 0.6,
      description: 'Queen capture - dramatic'
    }
  ],

  crowd_reaction: [
    {
      id: 'gasp-01',
      category: 'crowd_reaction',
      path: 'sounds/crowd/gasp-01.mp3',
      volume: 0.35,
      description: 'Crowd gasp for blunders'
    },
    {
      id: 'gasp-02',
      category: 'crowd_reaction',
      path: 'sounds/crowd/gasp-02.mp3',
      volume: 0.35,
      description: 'Crowd gasp variant'
    },
    {
      id: 'applause-01',
      category: 'crowd_reaction',
      path: 'sounds/crowd/applause-01.mp3',
      volume: 0.3,
      description: 'Applause for brilliant moves'
    },
    {
      id: 'applause-02',
      category: 'crowd_reaction',
      path: 'sounds/crowd/applause-02.mp3',
      volume: 0.3,
      description: 'Applause variant'
    },
    {
      id: 'murmur',
      category: 'crowd_reaction',
      path: 'sounds/crowd/murmur.mp3',
      volume: 0.2,
      description: 'Low crowd murmur for tense moments'
    },
    {
      id: 'cheer',
      category: 'crowd_reaction',
      path: 'sounds/crowd/cheer.mp3',
      volume: 0.4,
      description: 'Victory cheer for checkmate'
    }
  ],

  atmosphere: [
    {
      id: 'tournament-hall',
      category: 'atmosphere',
      path: 'sounds/atmosphere/tournament-hall.mp3',
      volume: 0.15,
      description: 'Background tournament ambience'
    },
    {
      id: 'chess-pieces-background',
      category: 'atmosphere',
      path: 'sounds/atmosphere/pieces-background.mp3',
      volume: 0.1,
      description: 'Subtle background piece movement sounds'
    }
  ],

  clock: [
    {
      id: 'clock-tick',
      category: 'clock',
      path: 'sounds/clock/tick.mp3',
      volume: 0.25,
      description: 'Chess clock ticking'
    },
    {
      id: 'clock-tick-fast',
      category: 'clock',
      path: 'sounds/clock/tick-fast.mp3',
      volume: 0.3,
      description: 'Faster ticking for time pressure'
    },
    {
      id: 'clock-press',
      category: 'clock',
      path: 'sounds/clock/press.mp3',
      volume: 0.3,
      description: 'Clock press sound'
    }
  ],

  special_moves: [
    {
      id: 'check',
      category: 'special_moves',
      path: 'sounds/special/check.mp3',
      volume: 0.4,
      description: 'Check sound'
    },
    {
      id: 'checkmate',
      category: 'special_moves',
      path: 'sounds/special/checkmate.mp3',
      volume: 0.5,
      description: 'Checkmate sound'
    },
    {
      id: 'castle',
      category: 'special_moves',
      path: 'sounds/special/castle.mp3',
      volume: 0.35,
      description: 'Castling sound'
    },
    {
      id: 'promotion',
      category: 'special_moves',
      path: 'sounds/special/promotion.mp3',
      volume: 0.4,
      description: 'Pawn promotion sound'
    }
  ]
};

/**
 * Get sound effect by ID
 */
export function getSoundEffect(id: string): SoundEffect | undefined {
  for (const category of Object.values(SOUND_EFFECTS)) {
    const effect = category.find(e => e.id === id);
    if (effect) return effect;
  }
  return undefined;
}

/**
 * Get random sound from category
 */
export function getRandomSound(category: SoundEffectCategory): SoundEffect {
  const sounds = SOUND_EFFECTS[category];
  return sounds[Math.floor(Math.random() * sounds.length)];
}

/**
 * Determine capture sound based on piece value
 */
export function getCaptureSound(capturedPiece: string): SoundEffect {
  const piece = capturedPiece.toLowerCase();

  if (piece === 'p') {
    return SOUND_EFFECTS.piece_capture[0]; // pawn
  } else if (piece === 'n' || piece === 'b') {
    return SOUND_EFFECTS.piece_capture[1]; // minor piece
  } else if (piece === 'r') {
    return SOUND_EFFECTS.piece_capture[2]; // rook
  } else if (piece === 'q') {
    return SOUND_EFFECTS.piece_capture[3]; // queen
  }

  return SOUND_EFFECTS.piece_capture[0]; // default to pawn sound
}

/**
 * Sound effect settings configuration
 */
export interface SoundEffectSettings {
  enabled: boolean;
  capturesEnabled: boolean;
  crowdEnabled: boolean;
  atmosphereEnabled: boolean;
  clockEnabled: boolean;
  specialMovesEnabled: boolean;
  masterVolume: number;
}

export const DEFAULT_SOUND_SETTINGS: SoundEffectSettings = {
  enabled: true,
  capturesEnabled: true,
  crowdEnabled: true,
  atmosphereEnabled: true,
  clockEnabled: false, // off by default as it can be distracting
  specialMovesEnabled: true,
  masterVolume: 1.0
};
