import Realm, { BSON } from 'realm';

export class GlobalStateModel extends Realm.Object {
  _id!: BSON.ObjectId;

  hasCheckedForCurseForge!: boolean;

  version: number = 1;

  static schema: Realm.ObjectSchema = {
    name: 'GlobalState',
    properties: {
      hasCheckedForCurseForge: 'bool',
      version: 'int',
    },
  };
}
