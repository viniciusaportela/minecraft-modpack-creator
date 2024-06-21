import { create } from 'zustand';
import { ITagsStore } from './interfaces/tags-store.interface';

export const useTagsStore = create<ITagsStore>(() => ({
  tags: [],
  version: 1,
}));
