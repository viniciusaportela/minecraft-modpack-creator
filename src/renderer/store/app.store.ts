import { create } from 'zustand';
import React from 'react';
import { persist } from 'zustand/middleware';
import { app, ipcRenderer } from 'electron';
import { IAppStore, IAppStored } from './interfaces/app-store.interface';
import { JsonStorage } from './storages/json-storage';

export const useAppStore = create<IAppStore, [['zustand/persist', IAppStored]]>(
  persist(
    (set, get) => ({
      isLoading: true,
      projects: [],
      projectMeta: null,
      title: 'My Projects',
      goBack: null,
      realm: null as any,
      configs: null,
      selectedProjectIndex: -1,
      headerMiddleComponent: null,
      setTitle: (title) => set({ title }),
      setGoBack: (goBack) => set({ goBack }),
      setHeaderMiddleComponent: (headerMiddleComponent: React.ReactNode) =>
        set({ headerMiddleComponent }),
      setIsLoaded: () => set({ isLoading: false }),
      selectedProject: null,
      userDataPath: '',
      setProject: (project) => {
        const { projects } = get();
        projects[project.index] = project;
        set({ projects });
      },
      setUserDataPath: (userDataPath) => set({ userDataPath }),
      selectProject: (index) =>
        set({
          selectedProjectIndex: index,
          selectedProject: get().projects[index],
        }),
    }),
    {
      name: 'app',
      onRehydrateStorage: () => {
        return async (st) => {
          const userDataPath = await ipcRenderer.invoke('getPath', 'userData');
          st!.setUserDataPath(userDataPath);
          st!.selectProject(st!.selectedProjectIndex);
          st!.setIsLoaded();
        };
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['selectedProjectIndex', 'projects'].includes(key),
          ),
        ) as IAppStored,
      storage: new JsonStorage(app.getPath('userData')),
    },
  ),
);
