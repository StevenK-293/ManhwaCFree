import axios from 'axios';
import { SearchResponse, MangaDetails, ChapterData } from './types';

const BASE_URL = 'https://manhwaclan-mauve.vercel.app';

/**
 * @param query The search term.
 * @param page The page number (default = 1).
 */
export const searchManga = async (query: string, page: number = 1): Promise<SearchResponse> => {
  const response = await axios.get(`${BASE_URL}/api/search`, {
    params: { s: query, page }
  });
  return response.data;
};

/**
 * Fetch manga details including chapters.
 * @param slug The manga slug.
 */
export const getMangaDetails = async (slug: string): Promise<MangaDetails> => {
  const response = await axios.get(`${BASE_URL}/manga/${slug}`);
  return response.data;
};

/**
 * @param slug The manga slug.
 * @param chapter The chapter identifier.
 */
export const getChapter = async (slug: string, chapter: string): Promise<ChapterData> => {
  const response = await axios.get(`${BASE_URL}/manga/${slug}/${chapter}`);
  return response.data;
};
