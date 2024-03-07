import Realm, { BSON, ObjectSchema, Types } from 'realm';
import { useAppStore } from '../../store/app.store';

export class ModModel extends Realm.Object {
  _id!: BSON.ObjectId;

  modId!: string;

  version!: string;

  name!: string;

  jarPath!: string;

  category?: string;

  config!: string;

  dependencies!: string[];

  tags!: string[];

  project!: Types.ObjectId;

  loadedTextures?: boolean;

  loadedItems?: boolean;

  loadedBlocks?: boolean;

  getConfig() {
    return JSON.parse(this.config);
  }

  writeConfig(config: Record<string, unknown>) {
    const { realm } = useAppStore.getState();

    realm.write(() => {
      this.config = JSON.stringify(config);
    });
  }

  static schema: ObjectSchema = {
    name: 'Mod',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectId(),
      },
      modId: 'string',
      version: 'string',
      name: 'string',
      jarPath: 'string',
      category: 'string?',
      config: 'string',
      dependencies: 'string[]',
      loadedTextures: {
        type: 'bool',
        default: false,
      },
      loadedItems: {
        type: 'bool',
        default: false,
      },
      loadedBlocks: {
        type: 'bool',
        default: false,
      },
      tags: {
        type: 'list',
        objectType: 'string',
        default: [],
      },
      project: {
        type: 'objectId',
        indexed: true,
      },
    },
    primaryKey: '_id',
  };
}
