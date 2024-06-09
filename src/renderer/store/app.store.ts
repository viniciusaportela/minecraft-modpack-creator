import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IAppStore, IAppStored } from './interfaces/app-store.interface';
import { JsonStorage } from './storages/json-storage';
import { UserDataPathCallback } from './CachedCallbacks';

export const useAppStore = create<
  IAppStore,
  [['zustand/persist', IAppStored], ['zustand/immer', never]]
>(
  persist(
    immer(
      (set, get) =>
        ({
          isLoaded: false,
          projects: [],
          configs: null,
          selectedProjectIndex: -1,
          userDataPath: '',
          headerMiddleComponent: null,
          selectedProject: () => {
            return get().projects[get().selectedProjectIndex];
          },
          goBack: null,
          title: '',
          load: () => set({ isLoaded: true }),
        }) as IAppStore,
    ),
    {
      name: 'app',
      onRehydrateStorage: (state) => {
        return (st, err) => {
          if (err) {
            console.error(err);
          } else {
            state.load();
          }
        };
      },
      partialize: (st) => ({
        projects: st.projects,
        selectedProjectIndex: st.selectedProjectIndex,
      }),
      storage: new JsonStorage(UserDataPathCallback),
    },
  ),
);

export const useSelectedProject = () =>
  useAppStore((st) => st.projects[st.selectedProjectIndex]);
