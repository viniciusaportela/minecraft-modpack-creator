import { create } from 'zustand';
import { IItemsStore } from './interfaces/items-store.interface';

export const useItemsStore = create<IItemsStore>((_, get) => ({
  items: [],
  findItem: (id: string) => get().items.find((item) => item.id === id),
  version: 1,
}));
