export interface IRecipesStore {
  recipes: any[];
  types: string[];
  version: number;
}

export type IRecipe = { type: string; filePath: string } & {
  [key: string]: any;
};
