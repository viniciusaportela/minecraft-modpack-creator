import { create } from 'zustand';
import { IMetadata } from './interfaces/metadata-store.interface';

export const useMetadataStore = create<IMetadata>(() => ({
  version: 1,
  modCount: 0,
  timestamp: Date.now(),
  worldPath: '',
  minecraftVersion: '',
  loaderVersion: '',
  modLoader: '',
  path: '',
}));
