import Realm, { BSON } from 'realm';
import { CURRENT_VERSION } from '../../constants/current_version';

export class GlobalStateModel extends Realm.Object {
  _id!: BSON.ObjectId;

  hasCheckedForProjects!: boolean;

  selectedProjectId?: string;

  version: number = 1;

  static schema: Realm.ObjectSchema = {
    name: 'GlobalState',
    properties: {
      hasCheckedForProjects: {
        type: 'bool',
        default: false,
      },
      selectedProjectId: 'string?',
      version: {
        type: 'int',
        default: CURRENT_VERSION,
      },
    },
  };
}
