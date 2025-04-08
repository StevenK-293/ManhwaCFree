import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type ReadingStatus = 'reading' | 'completed' | 'plan_to_read' | 'dropped';

interface ReadingListItem {
  id: string;
  mangaSlug: string;
  title: string;
  status: ReadingStatus;
  lastChapter?: string;
  lastRead: Date;
}

interface ReadingListState {
  items: ReadingListItem[];
  loading: boolean;
  addToList: (item: Omit<ReadingListItem, 'id' | 'lastRead'>) => Promise<void>;
  updateStatus: (mangaSlug: string, status: ReadingStatus) => Promise<void>;
  updateLastChapter: (mangaSlug: string, chapter: string) => Promise<void>;
  removeFromList: (mangaSlug: string) => Promise<void>;
  fetchList: () => Promise<void>;
}

export const useReadingListStore = create<ReadingListState>((set, get) => ({
  items: [],
  loading: false,
  addToList: async (item) => {
    const { data: existingItem } = await supabase
      .from('reading_list')
      .select()
      .eq('manga_slug', item.mangaSlug)
      .single();

    if (existingItem) {
      await supabase
        .from('reading_list')
        .update({
          status: item.status,
          last_chapter: item.lastChapter,
          last_read: new Date().toISOString(),
        })
        .eq('manga_slug', item.mangaSlug);
    } else {
      await supabase.from('reading_list').insert({
        manga_slug: item.mangaSlug,
        title: item.title,
        status: item.status,
        last_chapter: item.lastChapter,
        last_read: new Date().toISOString(),
      });
    }

    get().fetchList();
  },
  updateStatus: async (mangaSlug, status) => {
    await supabase
      .from('reading_list')
      .update({ status, last_read: new Date().toISOString() })
      .eq('manga_slug', mangaSlug);
    get().fetchList();
  },
  updateLastChapter: async (mangaSlug, chapter) => {
    await supabase
      .from('reading_list')
      .update({
        last_chapter: chapter,
        last_read: new Date().toISOString(),
      })
      .eq('manga_slug', mangaSlug);
    get().fetchList();
  },
  removeFromList: async (mangaSlug) => {
    await supabase
      .from('reading_list')
      .delete()
      .eq('manga_slug', mangaSlug);
    get().fetchList();
  },
  fetchList: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('reading_list')
      .select('*')
      .order('last_read', { ascending: false });
    
    if (data) {
      set({
        items: data.map(item => ({
          id: item.id,
          mangaSlug: item.manga_slug,
          title: item.title,
          status: item.status,
          lastChapter: item.last_chapter,
          lastRead: new Date(item.last_read),
        })),
      });
    }
    set({ loading: false });
  },
}));