import { create } from 'zustand';
import { IEffect, IEffectsStore } from './interfaces/effects-store.interface';

export const useBlocksStore = create<IEffectsStore>(() => ({
  effects: [],
  version: 1,
}));
