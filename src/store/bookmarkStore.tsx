import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Bookmark {
  id: string;
  mangaSlug: string;
  chapter: string;
  page: number;
  createdAt: Date;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (mangaSlug: string, chapter: string, page: number) => Promise<void>;
  removeBookmark: (mangaSlug: string, chapter: string) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  loading: false,

  addBookmark: async (mangaSlug, chapter, page) => {
    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select()
      .eq('manga_slug', mangaSlug)
      .eq('chapter', chapter)
      .single();

    if (existingBookmark) {
      await supabase
        .from('bookmarks')
        .update({ page })
        .eq('manga_slug', mangaSlug)
        .eq('chapter', chapter);
    } else {
      await supabase
        .from('bookmarks')
        .insert({ manga_slug: mangaSlug, chapter, page });
    }

    get().fetchBookmarks();
  },

  removeBookmark: async (mangaSlug, chapter) => {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('manga_slug', mangaSlug)
      .eq('chapter', chapter);

    get().fetchBookmarks();
  },

  fetchBookmarks: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      set({
        bookmarks: data.map(bookmark => ({
          id: bookmark.id,
          mangaSlug: bookmark.manga_slug,
          chapter: bookmark.chapter,
          page: bookmark.page,
          createdAt: new Date(bookmark.created_at),
        })),
      });
    }
    set({ loading: false });
  },
}));