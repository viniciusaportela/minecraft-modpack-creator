import { create } from 'zustand';
import { IEffectsStore } from './interfaces/effects-store.interface';

export const useEffectsStore = create<IEffectsStore>(() => ({
  effects: [],
  version: 1,
}));
