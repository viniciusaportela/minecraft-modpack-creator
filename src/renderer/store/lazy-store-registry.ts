import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { type Mutate, StoreApi } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import path from 'path';
import { UseBoundStore } from 'zustand/react';
import { IBaseModConfig } from './interfaces/mod-config.interface';
import { JsonStorage } from './storages/json-storage';
import { useAppStore } from './app.store';
import { IMod } from './interfaces/mods-store.interface';
import { IProjectStore } from './interfaces/project-store.interface';
import { ModFactory } from '../core/domains/mods/mod-factory';

let instance: LazyStoreRegistry;

function ModsFolderGetter() {
  return path.join(
    useAppStore.getState().selectedProject()!.path,
    'minecraft-toolkit',
    'mods',
  );
}

export class LazyStoreRegistry {
  constructor() {}

  private stores: Map<
    string,
    UseBoundStore<
      Mutate<StoreApi<any>, [['zustand/immer', null], ['zustand/persist', any]]>
    >
  > = new Map();

  static getInstance() {
    if (!instance) {
      instance = new LazyStoreRegistry();
    }

    return instance;
  }

  clear() {
    this.stores.clear();
  }

  get<T extends IBaseModConfig>(mod: IMod): StoreApi<T> {
    const modId = mod.id;

    if (!this.stores.has(modId)) {
      this.stores.set(
        modId,
        create(
          persist(
            immer((set) => ({
              isLoaded: false,
              isSetupDone: false,
              load: () => set({ isLoaded: true, isSetupDone: true }),
              set,
            })),
            {
              name: modId,
              storage: new JsonStorage(ModsFolderGetter, false),
              onRehydrateStorage: () => {
                return async (st, err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    if (!st!.isSetupDone) {
                      let additionalData = {};
                      if (mod) {
                        const modInstance = ModFactory.create(
                          useAppStore.getState().selectedProject(),
                          mod,
                          { isLoaded: false, isSetupDone: false },
                        );
                        additionalData = await modInstance.makeConfig();

                        st.set({ ...additionalData });
                      }
                    }

                    st.load();
                  }
                };
              },
            },
          ),
        ),
      );
    }

    return this.stores.get(modId)!;
  }

  getProjectStore(): UseBoundStore<
    Mutate<StoreApi<IProjectStore>, [['zustand/immer', null]]>
  > {
    const storePath =
      useAppStore.getState().selectedProject()?.path ?? '__project_default';

    if (!this.stores.has(storePath)) {
      this.stores.set(
        storePath,
        create(
          persist(
            immer(
              (set) =>
                ({
                  addedRecipes: [],
                  deletedRecipePaths: [],
                  deletedRecipes: [],
                  recipeModifiedOnlyFilter: false,
                  recipeRemovedOnlyFilter: false,
                  recipeIdFilter: '',
                  recipeItemFilter: '',
                  recipeModFilter: '',
                  recipeTypeFilter: '',
                  selectedRecipe: null,
                  editedRecipePaths: [],
                  editedRecipes: [],
                  items: [],
                  blocks: [],
                  loaded: false,
                  focusedTab: 'recipes',
                  openedTabs: [],
                  load: () => set({ loaded: true }),
                }) as IProjectStore,
            ),
            {
              name: 'project',
              partialize: (st) =>
                Object.fromEntries(
                  Object.entries(st).filter(
                    ([k]) =>
                      ![
                        'recipeIdFilter',
                        'recipeTypeFilter',
                        'recipeItemFilter',
                        'recipeModFilter',
                        'recipeRemovedOnlyFilter',
                        'recipeModifiedOnlyFilter',
                        'selectedRecipe',
                        'load',
                      ].includes(k),
                  ),
                ),
              storage: new JsonStorage(
                () =>
                  path.join(
                    useAppStore.getState().selectedProject()?.path ?? '',
                    'minecraft-toolkit',
                  ),
                false,
              ),
              onRehydrateStorage: () => {
                return (st, err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    st.load();
                  }
                };
              },
            },
          ),
        ),
      );
    }

    return this.stores.get(storePath)!;
  }
}
