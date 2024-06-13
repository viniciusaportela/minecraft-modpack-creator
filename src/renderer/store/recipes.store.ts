import { create } from 'zustand';
import { IRecipesStore } from './interfaces/recipes-store.interface';

export const useRecipesStore = create<IRecipesStore>(() => ({
  recipes: [],
  types: [],
  version: 1,
}));
