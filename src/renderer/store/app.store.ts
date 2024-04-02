import { create } from 'zustand';
import React from 'react';
import { IAppStore } from './interfaces/app-store.interface';

export const useAppStore = create<IAppStore>((set) => ({
  projectMeta: null,
  title: 'My Projects',
  goBack: null,
  realm: null as any,
  configs: null,
  selectedProjectId: null as any,
  headerMiddleComponent: null,
  setTitle: (title) => set({ title }),
  setGoBack: (goBack) => set({ goBack }),
  setHeaderMiddleComponent: (headerMiddleComponent: React.ReactNode) =>
    set({ headerMiddleComponent }),
}));
