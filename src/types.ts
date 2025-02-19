export interface MangaResult {
  title: string;
  url: string;
  image: string;
  status: string;
  genres: string[];
  latest_chapter: string;
  latest_chapter_url: string;
}

export interface SearchResponse {
  results: MangaResult[];
  currentPage: number;
  totalPages: number;
  nextPage: string | null;
  prevPage: string | null;
}

export interface MangaDetails {
  mangaUrl: string;
  summary: string;
  status: string;
  rating: string;
  rank: string;
  genres: string[];
  chapters: {
    title: string;
    url: string;
    date: string;
  }[];
}

export interface ChapterData {
  chapterUrl: string;
  images: {
    original: string;
    proxied: string;
  }[];
  prevChapter: string | null;
  nextChapter: string | null;
}