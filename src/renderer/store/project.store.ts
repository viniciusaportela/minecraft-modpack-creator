import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import path from 'path';
import { JsonStorage } from './storages/json-storage';
import { useAppStore } from './app.store';
import { IProjectStore } from './interfaces/project-store.interface';

create<IProjectStore, [['zustand/persist', never], ['zustand/immer', never]]>(
  persist(
    immer(
      (set, get) =>
        ({
          recipes: [],
          items: [],
          blocks: [],
          loaded: false,
          load: () => set({ loaded: true }),
        }) as IProjectStore,
    ),
    {
      name: 'project',
      onRehydrateStorage: () => {
        return (st, err) => {
          if (err) {
            console.error(err);
          } else {
            st!.load();
          }
        };
      },
      storage: new JsonStorage(
        () =>
          path.join(
            useAppStore.getState().selectedProject()!.path,
            'minecraft-toolkit',
          ),
        false,
      ),
    },
  ),
);
