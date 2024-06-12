import { create } from 'zustand';
import { IItemsStore } from './interfaces/items-store.interface';

export const useItemsStore = create<IItemsStore>(() => ({
  items: [],
  version: 1,
}));
