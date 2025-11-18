import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ja' | 'en';

interface SettingsState {
  categories: string[];
  products: string[];
  language: Language;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  resetCategories: () => void;
  addProduct: (product: string) => void;
  removeProduct: (product: string) => void;
  resetProducts: () => void;
  setLanguage: (language: Language) => void;
}

const defaultCategories = ['公共', '製薬', 'GCIT', 'Downstream', 'Activity', 'その他'];
const defaultProducts = ['Copilot Studio', 'Power Apps', 'Power Automate', 'PAD', 'Power Pages', 'Power Platform'];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      products: defaultProducts,
      language: 'ja' as Language,
      
      addCategory: (category) => set((state) => ({
        categories: state.categories.includes(category) 
          ? state.categories 
          : [...state.categories, category]
      })),
      
      removeCategory: (category) => set((state) => ({
        categories: state.categories.filter(c => c !== category)
      })),
      
      resetCategories: () => set({ categories: defaultCategories }),
      
      addProduct: (product) => set((state) => ({
        products: state.products.includes(product) 
          ? state.products 
          : [...state.products, product]
      })),
      
      removeProduct: (product) => set((state) => ({
        products: state.products.filter(p => p !== product)
      })),
      
      resetProducts: () => set({ products: defaultProducts }),
      
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
