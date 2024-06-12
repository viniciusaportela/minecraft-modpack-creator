import { create } from 'zustand';
import { IModsStore } from './interfaces/mods-store.interface';

export const useModsStore = create<IModsStore>(() => ({
  mods: [],
  version: 1,
}));
