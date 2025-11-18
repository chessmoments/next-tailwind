/**
 * Media Layer Component
 * Renders B-roll footage and images for enhanced production value
 */

import { AbsoluteFill, Video, Img, staticFile, interpolate, useCurrentFrame, Sequence } from 'remotion';
import type { MediaAsset } from '../../lib/media-library-config';

interface MediaLayerProps {
  media: MediaAsset;
  startFrame: number;
  durationInFrames: number;
  opacity?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

/**
 * Single media item with fade transitions
 */
export const MediaItem = ({
  media,
  startFrame,
  durationInFrames,
  opacity = 1.0,
  fadeInFrames = 15,
  fadeOutFrames = 15,
}: MediaLayerProps) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  // Calculate opacity with fade in/out
  const fadeInOpacity = interpolate(
    relativeFrame,
    [0, fadeInFrames],
    [0, opacity],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fadeOutOpacity = interpolate(
    relativeFrame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [opacity, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalOpacity = Math.min(fadeInOpacity, fadeOutOpacity);

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          opacity: finalOpacity,
          zIndex: 5, // Below UI elements, above background
        }}
      >
        {media.type === 'video' ? (
          <Video
            src={staticFile(media.path)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Img
            src={staticFile(media.path)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </AbsoluteFill>
    </Sequence>
  );
};

/**
 * Venue establishing shot - typically used in intro
 */
interface VenueEstablishingShotProps {
  media: MediaAsset;
  durationInFrames: number;
  startFrame?: number;
}

export const VenueEstablishingShot = ({
  media,
  durationInFrames,
  startFrame = 0,
}: VenueEstablishingShotProps) => {
  return (
    <MediaItem
      media={media}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      opacity={1.0}
      fadeInFrames={20}
      fadeOutFrames={20}
    />
  );
};

/**
 * Transition overlay - quick cuts between moves or sections
 */
interface TransitionOverlayProps {
  media: MediaAsset;
  startFrame: number;
  durationInFrames?: number;
}

export const TransitionOverlay = ({
  media,
  startFrame,
  durationInFrames = 45, // 1.5 seconds default
}: TransitionOverlayProps) => {
  return (
    <MediaItem
      media={media}
      startFrame={startFrame}
      durationInFrames={durationInFrames}
      opacity={0.4} // Subtle overlay
      fadeInFrames={10}
      fadeOutFrames={10}
    />
  );
};

/**
 * Picture-in-Picture player reaction
 * Small overlay in corner showing player photo/clip
 */
interface PlayerPictureInPictureProps {
  media: MediaAsset;
  startFrame: number;
  durationInFrames: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number; // Size in pixels
}

export const PlayerPictureInPicture = ({
  media,
  startFrame,
  durationInFrames,
  position = 'bottom-right',
  size = 240,
}: PlayerPictureInPictureProps) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  const fadeInOpacity = interpolate(
    relativeFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fadeOutOpacity = interpolate(
    relativeFrame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalOpacity = Math.min(fadeInOpacity, fadeOutOpacity);

  // Position styles
  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: 40, left: 40 },
    'top-right': { top: 40, right: 40 },
    'bottom-left': { bottom: 40, left: 40 },
    'bottom-right': { bottom: 40, right: 40 },
  };

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ zIndex: 20 }}>
        <div
          style={{
            position: 'absolute',
            ...positionStyles[position],
            width: size,
            height: size,
            borderRadius: '12px',
            overflow: 'hidden',
            border: '4px solid white',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            opacity: finalOpacity,
          }}
        >
          {media.type === 'video' ? (
            <Video
              src={staticFile(media.path)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Img
              src={staticFile(media.path)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

/**
 * Atmosphere overlay - subtle background enhancement
 * Used for clock ticks, board close-ups, etc.
 */
interface AtmosphereOverlayProps {
  media: MediaAsset;
  startFrame: number;
  durationInFrames: number;
  blendMode?: 'overlay' | 'soft-light' | 'multiply' | 'screen';
}

export const AtmosphereOverlay = ({
  media,
  startFrame,
  durationInFrames,
  blendMode = 'soft-light',
}: AtmosphereOverlayProps) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  const opacity = interpolate(
    relativeFrame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          opacity,
          mixBlendMode: blendMode,
          zIndex: 3,
        }}
      >
        {media.type === 'video' ? (
          <Video
            src={staticFile(media.path)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Img
            src={staticFile(media.path)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </AbsoluteFill>
    </Sequence>
  );
};
