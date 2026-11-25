import { SearchResult } from '../types';

const BASE_URL = 'https://itunes.apple.com/search';

// Search the iTunes catalogue for songs matching the given text.
export async function searchSongs(term: string): Promise<SearchResult[]> {
  const url = `${BASE_URL}?term=${encodeURIComponent(term)}&entity=song&limit=10`;
  const response = await fetch(url);

  // fetch only throws on network errors, not on HTTP errors like 404 or 500,
  // so we check the status ourselves.
  if (!response.ok) {
    throw new Error(`iTunes request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.results ?? [];
}