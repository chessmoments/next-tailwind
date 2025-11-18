/**
 * Sound Effect Trigger Logic
 * Determines when and which sound effects to play based on chess game events
 */

import { Chess } from 'chess.js';
import type { SoundEffect, SoundEffectSettings } from './sound-effects-config';
import {
  getCaptureSound,
  getRandomSound,
  SOUND_EFFECTS,
  getSoundEffect
} from './sound-effects-config';

export interface MoveAnalysis {
  move: string;
  fen: string;
  evaluation?: number;
  previousEvaluation?: number;
  capturedPiece?: string;
  isCheck: boolean;
  isCheckmate: boolean;
  isCastle: boolean;
  isPromotion: boolean;
  moveNumber: number;
}

export interface SoundTrigger {
  soundEffect: SoundEffect;
  startFrame: number;
  priority: number; // Higher priority sounds override lower ones
}

/**
 * Analyze a move and determine which sound effects should be triggered
 */
export function analyzeMoveForSounds(
  analysis: MoveAnalysis,
  settings: SoundEffectSettings
): SoundEffect[] {
  if (!settings.enabled) return [];

  const sounds: SoundEffect[] = [];

  // Special moves (highest priority)
  if (settings.specialMovesEnabled) {
    if (analysis.isCheckmate) {
      const checkmateSound = getSoundEffect('checkmate');
      if (checkmateSound) sounds.push(checkmateSound);
    } else if (analysis.isCheck) {
      const checkSound = getSoundEffect('check');
      if (checkSound) sounds.push(checkSound);
    } else if (analysis.isCastle) {
      const castleSound = getSoundEffect('castle');
      if (castleSound) sounds.push(castleSound);
    } else if (analysis.isPromotion) {
      const promotionSound = getSoundEffect('promotion');
      if (promotionSound) sounds.push(promotionSound);
    }
  }

  // Captures
  if (settings.capturesEnabled && analysis.capturedPiece) {
    const captureSound = getCaptureSound(analysis.capturedPiece);
    sounds.push(captureSound);
  }

  // Crowd reactions based on evaluation changes
  if (settings.crowdEnabled && analysis.evaluation !== undefined && analysis.previousEvaluation !== undefined) {
    const evalChange = Math.abs(analysis.evaluation - analysis.previousEvaluation);

    // Major blunder (eval swing > 200 centipawns = 2 pawns)
    if (evalChange > 200) {
      sounds.push(getRandomSound('crowd_reaction')); // gasp
    }
    // Brilliant move (eval improvement > 150 centipawns)
    else if (analysis.evaluation - analysis.previousEvaluation > 150) {
      const applause = SOUND_EFFECTS.crowd_reaction.find(s => s.id.includes('applause'));
      if (applause) sounds.push(applause);
    }
  }

  // Apply master volume to all sounds
  return sounds.map(sound => ({
    ...sound,
    volume: (sound.volume || 0.5) * settings.masterVolume
  }));
}

/**
 * Determine atmosphere sounds for video segment
 */
export function getAtmosphereSounds(
  gamePhase: 'opening' | 'middlegame' | 'endgame',
  settings: SoundEffectSettings
): SoundEffect[] {
  if (!settings.atmosphereEnabled || !settings.enabled) return [];

  const sounds: SoundEffect[] = [];

  // Tournament hall ambience (always present if enabled)
  const hallSound = getSoundEffect('tournament-hall');
  if (hallSound) {
    sounds.push({
      ...hallSound,
      volume: (hallSound.volume || 0.15) * settings.masterVolume
    });
  }

  return sounds;
}

/**
 * Parse chess move and extract analysis data
 */
export function parseMoveForAnalysis(
  chess: Chess,
  move: string,
  moveNumber: number,
  previousEval?: number,
  currentEval?: number
): MoveAnalysis {
  const moveObj = chess.move(move);

  return {
    move,
    fen: chess.fen(),
    evaluation: currentEval,
    previousEvaluation: previousEval,
    capturedPiece: moveObj?.captured,
    isCheck: chess.isCheck(),
    isCheckmate: chess.isCheckmate(),
    isCastle: moveObj?.san.includes('O-O') || false,
    isPromotion: moveObj?.promotion !== undefined,
    moveNumber
  };
}

/**
 * Calculate frame timing for sound effects in Remotion video
 * @param moveIndex - Index of the move in the game
 * @param fps - Frames per second (default 30)
 * @param introDuration - Duration of intro in frames
 * @param frameDurationPerMove - Frames per move (default 30 = 1 second)
 */
export function calculateSoundFrameTiming(
  moveIndex: number,
  fps: number = 30,
  introDuration: number = 90, // 3 seconds
  frameDurationPerMove: number = 30 // 1 second per move
): number {
  return introDuration + (moveIndex * frameDurationPerMove);
}

/**
 * Generate sound trigger schedule for entire game
 */
export function generateSoundSchedule(
  moves: string[],
  evaluations: (number | undefined)[],
  settings: SoundEffectSettings,
  fps: number = 30
): SoundTrigger[] {
  const chess = new Chess();
  const triggers: SoundTrigger[] = [];
  let previousEval: number | undefined = undefined;

  moves.forEach((move, index) => {
    const currentEval = evaluations[index];
    const analysis = parseMoveForAnalysis(chess, move, index + 1, previousEval, currentEval);
    const sounds = analyzeMoveForSounds(analysis, settings);

    const frameStart = calculateSoundFrameTiming(index, fps);

    sounds.forEach((sound, soundIndex) => {
      triggers.push({
        soundEffect: sound,
        startFrame: frameStart + (soundIndex * 5), // Slight offset if multiple sounds
        priority: getPriority(sound)
      });
    });

    previousEval = currentEval;
  });

  // Sort by frame and priority
  return triggers.sort((a, b) => {
    if (a.startFrame !== b.startFrame) {
      return a.startFrame - b.startFrame;
    }
    return b.priority - a.priority; // Higher priority first
  });
}

/**
 * Determine sound priority for layering
 */
function getPriority(sound: SoundEffect): number {
  switch (sound.category) {
    case 'special_moves': return 5;
    case 'crowd_reaction': return 4;
    case 'piece_capture': return 3;
    case 'clock': return 2;
    case 'atmosphere': return 1;
    default: return 0;
  }
}

/**
 * Filter overlapping sounds (prevent audio clutter)
 * Keeps only the highest priority sound within a 15-frame window
 */
export function filterOverlappingSounds(
  triggers: SoundTrigger[],
  maxFrameDistance: number = 15
): SoundTrigger[] {
  const filtered: SoundTrigger[] = [];

  triggers.forEach(trigger => {
    const hasConflict = filtered.some(
      existing =>
        Math.abs(existing.startFrame - trigger.startFrame) < maxFrameDistance &&
        existing.priority >= trigger.priority
    );

    if (!hasConflict) {
      filtered.push(trigger);
    }
  });

  return filtered;
}
