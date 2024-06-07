import { create } from 'zustand';
import { IEntitiesStore } from './interfaces/entities-store.interface';

export const useEntitiesStore = create<IEntitiesStore>(() => ({
  entities: [],
  version: 1,
}));
