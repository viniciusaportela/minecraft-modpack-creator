import { create } from 'zustand';
import React from 'react';
import { persist } from 'zustand/middleware';
import { IAppStore, IAppStored } from './interfaces/app-store.interface';
import { JsonStorage } from './storages/json-storage';
import { UserDataPathCallback } from './CachedCallbacks';
import { IProject } from './interfaces/project.interface';

export const useAppStore = create<IAppStore, [['zustand/persist', IAppStored]]>(
  persist(
    (set, get) =>
      ({
        isLoading: true,
        projects: [],
        title: 'My Projects',
        goBack: null,
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
          if (project.index == get().selectedProjectIndex) {
            set({ selectedProject: project });
          }
          const { projects } = get();
          projects[project.index] = project;
          set({ projects });
        },
        addProject: (project: Omit<IProject, 'index'>) => {
          const { projects } = get();
          set({
            projects: [
              ...projects,
              {
                ...project,
                index: projects.length,
              },
            ],
          });
        },
        setUserDataPath: (userDataPath) => set({ userDataPath }),
        selectProject: (index) =>
          set({
            selectedProjectIndex: index,
            selectedProject: get().projects[index],
          }),
      }) as IAppStore,
    {
      name: 'app',
      onRehydrateStorage: () => {
        return async (st, err) => {
          console.error(err);
          if (st?.selectedProjectIndex !== -1) {
            st!.selectProject(st!.selectedProjectIndex);
          }
          st!.setIsLoaded();
        };
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['selectedProjectIndex', 'projects'].includes(key),
          ),
        ) as IAppStored,
      storage: new JsonStorage(UserDataPathCallback),
    },
  ),
);
