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

  amountInstalledMods?: number;

  textures?: TextureModel[];

  items?: ItemModel[];

  blocks?: BlockModel[];

  mods?: ModModel[];

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
      amountInstalledMods: 'int',
      fromCurseForge: 'bool',
      version: 'int',
      loaded: {
        type: 'bool',
        default: false,
      },
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
    primaryKey: '_id',
  };
}
