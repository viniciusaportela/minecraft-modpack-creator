import Realm, { BSON, ObjectSchema } from 'realm';
import { TextureModel } from './texture.model';
import { ModModel } from './mod.model';
import { BlockModel } from './block.model';
import { ItemModel } from './item.model';

export class ProjectModel extends Realm.Object {
  _id!: BSON.ObjectId;

  name!: string;

  path!: string;

  minecraftVersion!: string;

  loaderVersion!: string;

  loader!: string;

  version!: number;

  loaded!: boolean;

  fromCurseForge!: boolean;

  modsChecksum?: string;

  textures?: TextureModel[];

  items?: ItemModel[];

  blocks?: BlockModel[];

  mods?: ModModel[];

  static schema: ObjectSchema = {
    name: 'Project',
    properties: {
      name: 'string',
      path: 'string',
      minecraftVersion: 'string',
      loaderVersion: 'string',
      loader: 'string',
      fromCurseForge: 'bool',
      version: 'int',
      loaded: 'bool',
      modsChecksum: 'string?',
      textures: {
        type: 'list',
        objectType: 'Texture',
        default: [],
      },
      items: {
        type: 'list',
        objectType: 'Item',
        default: [],
      },
      blocks: {
        type: 'list',
        objectType: 'Block',
        default: [],
      },
      mods: {
        type: 'list',
        objectType: 'Mod',
        default: [],
      },
    },
    primaryKey: 'name',
  };
}
