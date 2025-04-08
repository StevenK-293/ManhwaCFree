import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryItem {
  slug: string;
  title: string;
  chapter: string;
  timestamp: number;
}

interface HistoryState {
  items: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addToHistory: (item) => {
        set((state) => {
          const newItems = state.items.filter(
            (i) => i.slug !== item.slug || i.chapter !== item.chapter
          );
          return {
            items: [
              { ...item, timestamp: Date.now() },
              ...newItems,
            ].slice(0, 100), // Keep only last 100 items
          };
        });
      },
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'reading-history',
    }
  )
);