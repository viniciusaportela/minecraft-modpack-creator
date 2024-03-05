import Realm, { BSON, ObjectSchema } from 'realm';
import { useAppStore } from '../../store/app.store';

export class ProjectModel extends Realm.Object {
  _id!: BSON.ObjectId;

  name!: string;

  path!: string;

  minecraftVersion!: string;

  loaderVersion!: string;

  loader!: string;

  version!: number;

  loaded!: boolean;

  source!: string;

  cachedAmountInstalledMods?: number;

  modsChecksum?: string;

  orphan!: boolean;

  recipes!: string;

  getRecipes(): Record<string, unknown>[] {
    return JSON.parse(this.recipes!);
  }

  removeRecipe(index: number) {
    const recipes = this.getRecipes();
    recipes.splice(index, 1);

    const { realm } = useAppStore.getState();
    realm.write(() => {
      this.recipes = JSON.stringify(recipes);
    });
  }

  static schema: ObjectSchema = {
    name: 'Project',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new BSON.ObjectId(),
      },
      name: 'string',
      path: 'string',
      minecraftVersion: 'string',
      loaderVersion: 'string',
      loader: 'string',
      source: 'string',
      cachedAmountInstalledMods: 'int?',
      modsChecksum: 'string?',
      orphan: {
        type: 'bool',
        default: false,
      },
      loaded: {
        type: 'bool',
        default: false,
      },
      recipes: 'string',
    },
    primaryKey: '_id',
  };
}
