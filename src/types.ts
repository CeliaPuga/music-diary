// Shared data types used across the app.

export type Song = {
  id: string;
  title: string;
  artist: string;
  mood: string;
  note: string;
  createdAt: string; // ISO date string, e.g. "2026-11-25T10:54:00.000Z"
  artworkUrl?: string;
  previewUrl?: string;
};

export type SearchResult = {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100?: string;
  previewUrl?: string;
};