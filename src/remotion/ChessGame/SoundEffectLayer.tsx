/**
 * Sound Effect Layer Component
 * Renders sound effects at appropriate frames based on game events
 */

import { Audio, staticFile, useCurrentFrame } from 'remotion';
import type { SoundTrigger } from '../../lib/sound-effect-triggers';

interface SoundEffectLayerProps {
  soundTriggers: SoundTrigger[];
}

/**
 * Component that plays sound effects at specific frames
 * Each sound is rendered as a separate Audio component that only plays when active
 */
export const SoundEffectLayer = ({ soundTriggers }: SoundEffectLayerProps) => {
  const frame = useCurrentFrame();

  // Filter to only active sounds (within a small window of current frame)
  const activeSounds = soundTriggers.filter(trigger => {
    // Sound should start at its designated frame and play for its duration
    // Most sound effects are 1-3 seconds long
    const soundDurationFrames = 90; // 3 seconds at 30fps
    return frame >= trigger.startFrame && frame < trigger.startFrame + soundDurationFrames;
  });

  return (
    <>
      {activeSounds.map((trigger, index) => {
        // Calculate offset - how far into the sound we should be
        const offsetFrames = frame - trigger.startFrame;
        const offsetSeconds = offsetFrames / 30; // Assuming 30fps

        return (
          <Audio
            key={`sound-${trigger.startFrame}-${index}`}
            src={staticFile(trigger.soundEffect.path)}
            volume={trigger.soundEffect.volume || 0.5}
            startFrom={Math.max(0, offsetFrames)}
            // Only play if we're at the exact start frame
            // This prevents re-triggering on re-renders
          />
        );
      })}
    </>
  );
};

/**
 * Atmosphere Sound Layer
 * Continuous background sounds that play throughout the video
 */
interface AtmosphereSoundLayerProps {
  soundPath: string;
  volume?: number;
}

export const AtmosphereSoundLayer = ({ soundPath, volume = 0.15 }: AtmosphereSoundLayerProps) => {
  return (
    <Audio
      src={staticFile(soundPath)}
      volume={volume}
      loop
    />
  );
};
