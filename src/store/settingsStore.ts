import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  resetCategories: () => void;
}

const defaultCategories = ['公共', '製薬', 'GCIT', 'Downstream', 'Activity', 'その他'];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      
      addCategory: (category) => set((state) => ({
        categories: state.categories.includes(category) 
          ? state.categories 
          : [...state.categories, category]
      })),
      
      removeCategory: (category) => set((state) => ({
        categories: state.categories.filter(c => c !== category)
      })),
      
      resetCategories: () => set({ categories: defaultCategories }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
