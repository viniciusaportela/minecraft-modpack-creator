import { writeFile } from 'node:fs/promises';
import path from 'path';
import { DefaultMod } from '../default-mod';
import { LazyStoreRegistry } from '../../../../store/lazy-store-registry';
import {
  ICustomRecipe,
  IDeleteRecipe,
  IEditRecipe,
} from '../../../../store/interfaces/project-store.interface';
import { useRecipesStore } from '../../../../store/recipes.store';
import { IRecipe } from '../../../../store/interfaces/recipes-store.interface';

export class KubeJS extends DefaultMod {
  async build() {
    // TODO delete old data

    const projectStore = LazyStoreRegistry.getInstance().getProjectStore();

    const recipes = projectStore.getState().addedRecipes;
    const edited = projectStore.getState().editedRecipes;
    const deleted = projectStore.getState().deletedRecipes;
    const js = await this.buildRecipesJs(recipes, edited, deleted);

    const recipesJsPath = path.join(
      this.project.path,
      'kubejs',
      'server_scripts',
      'recipes.js',
    );
    await writeFile(recipesJsPath, js);
  }

  private async buildRecipesJs(
    addedRecipes: ICustomRecipe[],
    editedRecipes: IEditRecipe[],
    deletedRecipes: IDeleteRecipe[],
  ) {
    return `ServerEvents.recipes(event => {
        ${this.buildAddedRecipeJs(addedRecipes)}
        ${this.buildEditedRecipeJs(editedRecipes)}
        ${this.buildDeletedRecipeJs(deletedRecipes)}
      })
    `;
  }

  async preBuild() {}

  async postBuild() {}

  private buildAddedRecipeJs(addedRecipes: ICustomRecipe[]) {
    return addedRecipes
      .map((recipe) => `event.custom(${recipe.json});`)
      .join('\n');
  }

  private buildEditedRecipeJs(editedRecipes: IEditRecipe[]) {
    const allRecipes = useRecipesStore.getState().recipes;

    return editedRecipes
      .map((recipe) => {
        const fullRecipe = allRecipes.find(
          (r) => r.filePath === recipe.filePath,
        )!;

        const recipeId = this.getRecipeId(fullRecipe);

        return `event.remove({ id: '${recipeId}' });
          event.custom(${recipe.json});`;
      })
      .join('\n');
  }

  private getRecipeId(recipe: IRecipe) {
    const modId = recipe.filePath.split('/')[1];
    const JsonName = path.basename(recipe.filePath);
    return `${modId}:${JsonName}`;
  }

  private buildDeletedRecipeJs(deletedRecipes: IDeleteRecipe[]) {
    const allRecipes = useRecipesStore.getState().recipes;

    return deletedRecipes
      .map((recipe) => {
        const fullRecipe = allRecipes.find(
          (r) => r.filePath === recipe.filePath,
        )!;

        const recipeId = this.getRecipeId(fullRecipe);

        return `event.remove({ id: '${recipeId}' });`;
      })
      .join('\n');
  }
}
