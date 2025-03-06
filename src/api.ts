import axios from 'axios';
import { SearchResponse, MangaDetails, ChapterData } from './types';

const BASE_URL = 'https://manhwaclan-mauve.vercel.app';

/**
 * @param query The search term.
 * @param page number (default = 1).
 */
export const searchManga = async (query: string, page: number = 1): Promise<SearchResponse> => {
  const response = await axios.get(`${BASE_URL}/api/search`, {
    params: { s: query, page }
  });
  return response.data;
};

/**
 * Fetch manga details.
 * @param manga slug.
 */
export const getMangaDetails = async (slug: string): Promise<MangaDetails> => {
  const response = await axios.get(`${BASE_URL}/manga/${slug}`);
  return response.data;
};

/**
 * @param manga slug.
 * @param chapter identifier.
 */
export const getChapter = async (slug: string, chapter: string): Promise<ChapterData> => {
  const response = await axios.get(`${BASE_URL}/manga/${slug}/${chapter}`);
  return response.data;
};
