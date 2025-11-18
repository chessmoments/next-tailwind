/**
 * Media Library Configuration for B-Roll Integration
 * Manages tournament venue footage, player photos, and atmosphere clips
 */

export type MediaType = 'video' | 'image';
export type MediaCategory =
  | 'venue_exterior'
  | 'venue_hall'
  | 'player_photo'
  | 'player_video'
  | 'atmosphere'
  | 'transition';

export interface MediaAsset {
  id: string;
  type: MediaType;
  category: MediaCategory;
  path: string;
  duration?: number; // in seconds, for videos
  description: string;
  tags?: string[];
  tournamentId?: string;
  playerId?: string;
}

/**
 * Default stock media library
 * Can be augmented with user-uploaded content per tournament
 */
export const DEFAULT_MEDIA_LIBRARY: MediaAsset[] = [
  // Venue establishing shots
  {
    id: 'stock-venue-exterior-01',
    type: 'image',
    category: 'venue_exterior',
    path: 'media/stock/venue/exterior-01.jpg',
    description: 'Generic tournament hall exterior',
    tags: ['establishing', 'intro']
  },
  {
    id: 'stock-venue-hall-01',
    type: 'video',
    category: 'venue_hall',
    path: 'media/stock/venue/hall-wide-01.mp4',
    duration: 5,
    description: 'Wide shot of chess tournament hall',
    tags: ['establishing', 'atmosphere']
  },

  // Atmosphere clips
  {
    id: 'stock-clock-closeup',
    type: 'video',
    category: 'atmosphere',
    path: 'media/stock/atmosphere/clock-closeup.mp4',
    duration: 3,
    description: 'Chess clock close-up',
    tags: ['clock', 'tension']
  },
  {
    id: 'stock-board-overhead',
    type: 'video',
    category: 'atmosphere',
    path: 'media/stock/atmosphere/board-overhead.mp4',
    duration: 4,
    description: 'Overhead shot of chess board',
    tags: ['board', 'transition']
  },
  {
    id: 'stock-pieces-closeup',
    type: 'video',
    category: 'atmosphere',
    path: 'media/stock/atmosphere/pieces-closeup.mp4',
    duration: 3,
    description: 'Close-up of chess pieces',
    tags: ['pieces', 'artistic']
  },

  // Transition clips
  {
    id: 'stock-hand-move',
    type: 'video',
    category: 'transition',
    path: 'media/stock/transitions/hand-move.mp4',
    duration: 2,
    description: 'Hand making a chess move',
    tags: ['transition', 'move']
  },
  {
    id: 'stock-clock-press',
    type: 'video',
    category: 'transition',
    path: 'media/stock/transitions/clock-press.mp4',
    duration: 1.5,
    description: 'Hand pressing chess clock',
    tags: ['transition', 'clock']
  }
];

/**
 * Media library settings for video generation
 */
export interface MediaLibrarySettings {
  enabled: boolean;
  useVenueShots: boolean;
  usePlayerMedia: boolean;
  useAtmosphere: boolean;
  useTransitions: boolean;
  preferUserUploads: boolean; // Prefer user-uploaded over stock
}

export const DEFAULT_MEDIA_SETTINGS: MediaLibrarySettings = {
  enabled: true,
  useVenueShots: true,
  usePlayerMedia: true,
  useAtmosphere: true,
  useTransitions: true,
  preferUserUploads: true
};

/**
 * Get media assets by category
 */
export function getMediaByCategory(
  category: MediaCategory,
  library: MediaAsset[] = DEFAULT_MEDIA_LIBRARY
): MediaAsset[] {
  return library.filter(asset => asset.category === category);
}

/**
 * Get media assets for specific tournament
 */
export function getTournamentMedia(
  tournamentId: string,
  library: MediaAsset[]
): MediaAsset[] {
  return library.filter(asset => asset.tournamentId === tournamentId);
}

/**
 * Get media assets for specific player
 */
export function getPlayerMedia(
  playerId: string,
  library: MediaAsset[]
): MediaAsset[] {
  return library.filter(asset => asset.playerId === playerId);
}

/**
 * Get random media from category
 */
export function getRandomMedia(
  category: MediaCategory,
  library: MediaAsset[] = DEFAULT_MEDIA_LIBRARY
): MediaAsset | undefined {
  const assets = getMediaByCategory(category, library);
  if (assets.length === 0) return undefined;
  return assets[Math.floor(Math.random() * assets.length)];
}

/**
 * Select appropriate media for video segment
 */
export function selectMediaForSegment(
  segmentType: 'intro' | 'transition' | 'outro' | 'atmosphere',
  settings: MediaLibrarySettings,
  tournamentId?: string,
  customLibrary?: MediaAsset[]
): MediaAsset | undefined {
  if (!settings.enabled) return undefined;

  const library = customLibrary || DEFAULT_MEDIA_LIBRARY;

  switch (segmentType) {
    case 'intro':
      if (!settings.useVenueShots) return undefined;
      // Try tournament-specific first
      if (tournamentId && settings.preferUserUploads) {
        const tournamentVenue = library.find(
          m => m.tournamentId === tournamentId &&
               (m.category === 'venue_exterior' || m.category === 'venue_hall')
        );
        if (tournamentVenue) return tournamentVenue;
      }
      // Fall back to stock
      return getRandomMedia('venue_hall', library) ||
             getRandomMedia('venue_exterior', library);

    case 'transition':
      if (!settings.useTransitions) return undefined;
      return getRandomMedia('transition', library);

    case 'atmosphere':
      if (!settings.useAtmosphere) return undefined;
      return getRandomMedia('atmosphere', library);

    case 'outro':
      if (!settings.useVenueShots) return undefined;
      return getRandomMedia('venue_hall', library);

    default:
      return undefined;
  }
}

/**
 * Tournament media upload configuration
 */
export interface TournamentMediaUpload {
  tournamentId: string;
  assets: MediaAsset[];
}

/**
 * Validate media asset for upload
 */
export function validateMediaAsset(asset: Partial<MediaAsset>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!asset.type) errors.push('Media type is required');
  if (!asset.category) errors.push('Media category is required');
  if (!asset.path) errors.push('Media path is required');
  if (!asset.description) errors.push('Description is required');

  if (asset.type === 'video' && !asset.duration) {
    errors.push('Duration is required for video assets');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
