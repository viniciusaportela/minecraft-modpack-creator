import Realm, { BSON, ObjectSchema, Types } from 'realm';
import { useAppStore } from '../../store/app.store';
import { ModConfigModel } from './mod-config.model';

export class ModModel extends Realm.Object {
  _id!: BSON.ObjectId;

  modId!: string;

  version!: string;

  name!: string;

  jarPath!: string;

  category?: string;

  getConfig() {
    const { realm } = useAppStore.getState();
    return realm
      .objects<ModConfigModel>(ModConfigModel.schema.name)
      .filtered('mod = $0', this._id)[0];
  }

  dependencies!: string[];

  tags!: string[];

  project!: Types.ObjectId;

  loadedTextures?: boolean;

  loadedItems?: boolean;

  loadedBlocks?: boolean;

  thumbnail?: string;

  website?: string;

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
      thumbnail: 'string?',
      website: 'string?',
    },
    primaryKey: '_id',
  };
}
