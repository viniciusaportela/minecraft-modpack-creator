import path from 'path';
import { readFile } from 'node:fs/promises';
import { UseBoundStore } from 'zustand/react';
import { StoreApi } from 'zustand/vanilla';
import { IProject } from '../../../store/interfaces/project.interface';
import { useModsStore } from '../../../store/mods.store';
import { useItemsStore } from '../../../store/items.store';
import { useBlocksStore } from '../../../store/blocks.store';
import { useEffectsStore } from '../../../store/effects.store';
import { useAttributesStore } from '../../../store/attributes.store';
import { useMetadataStore } from '../../../store/metadata.store';
import { useEntitiesStore } from '../../../store/entities.store';
import { usePotionsStore } from '../../../store/potions.store';
import { useTexturesStore } from '../../../store/textures.store';
import { LazyStoreRegistry } from '../../../store/lazy-store-registry';
import { useRecipesStore } from '../../../store/recipes.store';
import { useTagsStore } from '../../../store/tags.store';

let instance: ProjectPreloader;

export class ProjectPreloader {
  project!: IProject;

  static getInstance() {
    if (!instance) {
      instance = new ProjectPreloader();
    }

    return instance;
  }

  async load(project: IProject) {
    this.project = project;

    await this.loadStore('mods');
    await this.loadStore('items');
    await this.loadStore('blocks');
    await this.loadStore('metadata');
    await this.loadStore('attributes');
    await this.loadStore('effects');
    await this.loadStore('entities');
    await this.loadStore('potions');
    await this.loadStore('textures');
    await this.loadStore('recipes');
    await this.loadStore('tags');

    LazyStoreRegistry.getInstance().getProjectStore();
  }

  private getStore(storeName: string) {
    switch (storeName) {
      case 'mods':
        return useModsStore;
      case 'items':
        return useItemsStore;
      case 'blocks':
        return useBlocksStore;
      case 'metadata':
        return useMetadataStore;
      case 'attributes':
        return useAttributesStore;
      case 'effects':
        return useEffectsStore;
      case 'entities':
        return useEntitiesStore;
      case 'potions':
        return usePotionsStore;
      case 'textures':
        return useTexturesStore;
      case 'recipes':
        return useRecipesStore;
      case 'tags':
        return useTagsStore;
      default:
        throw new Error(`Unknown store: ${storeName}`);
    }
  }

  async loadStore(storeName: string) {
    const basePath = path.join(this.project.path, 'minecraft-toolkit');
    const store: UseBoundStore<StoreApi<any>> = this.getStore(storeName);

    const json = JSON.parse(
      await readFile(path.join(basePath, `${storeName}.json`), 'utf-8'),
    );

    store.setState(json);
  }
}
