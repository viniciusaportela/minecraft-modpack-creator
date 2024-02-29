import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ipcRenderer } from 'electron';
import { IProjectStore } from './interfaces/project-store.interface';

const DEFAULTS_VALUES = {
  modpackFolder: '',
  recipes: [],
  kubejsScripts: [],
};

// TODO remove
export const useProjectStore = create(
  persist<IProjectStore>(() => ({ ...DEFAULTS_VALUES }), {
    name: 'project-store',
    storage: {
      getItem: () => {
        return {
          state: {
            modpackFolder: '',
            recipes: [],
            kubejsScripts: [],
          },
          version: 0,
        };
      },
      setItem: async (name, value) => {
        if (value.state.modpackFolder) {
          await ipcRenderer.invoke(
            'writeConfig',
            value.state.modpackFolder,
            value.state,
          );
        }
      },
      removeItem: async () => {},
    },
  }),
);
