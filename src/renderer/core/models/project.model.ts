import Realm, { BSON, ObjectSchema } from 'realm';
import { IProjectData } from '../domains/launchers/base/base-launcher';

export class ProjectModel extends Realm.Object implements IProjectData {
  _id!: BSON.ObjectId;

  name!: string;

  path!: string;

  minecraftVersion!: string;

  loaderVersion!: string;

  loader!: string;

  version!: number;

  loaded!: boolean;

  launcher!: string;

  cachedAmountInstalledMods?: number;

  modsChecksum?: string;

  orphan!: boolean;

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
      launcher: 'string',
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
    },
    primaryKey: '_id',
  };
}
