import { IMod } from './mods-store.interface';
import { IRecipe } from './recipes-store.interface';

export interface IProjectStore {
  addedRecipes: ICustomRecipe[];
  deletedRecipes: IDeleteRecipe[];
  editedRecipes: IEditRecipe[];

  // Recipes filter
  recipeIdFilter: string;
  recipeTypeFilter: string;
  recipeItemFilter: string;
  recipeModFilter: string;
  recipeRemovedOnlyFilter: boolean;
  recipeModifiedOnlyFilter: boolean;

  items: any[];
  blocks: any[];
  loaded: boolean;
  openedTabs: IMod[];
  focusedTab: string;
  load: () => void;
  selectedRecipe: IRecipe | ICustomRecipe | null;
}

export interface ICustomRecipe {
  json: string;
  name: string;
  index: number;
  isCustomRecipe: true;
}

export const isCustomRecipe = (
  recipe: IRecipe | ICustomRecipe | null,
): recipe is ICustomRecipe => !!recipe?.isCustomRecipe;

export interface IDeleteRecipe {
  filePath: string;
}

export interface IEditRecipe {
  filePath: string;
  json: string;
}
