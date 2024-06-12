import { create } from 'zustand';
import { IPotionsStore } from './interfaces/potions-store.interface';

export const usePotionsStore = create<IPotionsStore>(() => ({
  potions: [],
  version: 1,
}));
