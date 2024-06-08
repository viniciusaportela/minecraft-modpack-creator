import { create } from 'zustand';
import { IAttributesStore } from './interfaces/attributes-store.interface';

export const useAttributesStore = create<IAttributesStore>(() => ({
  attributes: [],
  version: 1,
}));
