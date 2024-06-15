import { IMod } from './mods-store.interface';

export interface IProjectStore {
  addedRecipes: ICustomRecipe[];
  deletedRecipes: IDeleteRecipe[];
  editedRecipes: IEditRecipe[];
  items: any[];
  blocks: any[];
  loaded: boolean;
  openedTabs: IMod[];
  focusedTab: string;
  load: () => void;
}

export interface ICustomRecipe {
  json: string;
}

export interface IDeleteRecipe {
  filePath: string;
}

export interface IEditRecipe {
  filePath: string;
  json: string;
}
