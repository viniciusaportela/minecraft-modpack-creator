import Realm, { BSON, Types } from 'realm';

export class GlobalStateModel extends Realm.Object {
  _id!: BSON.ObjectId;

  hasCheckedForProjects!: boolean;

  selectedProjectId?: Types.ObjectId;

  static schema: Realm.ObjectSchema = {
    name: 'GlobalState',
    properties: {
      hasCheckedForProjects: {
        type: 'bool',
        default: false,
      },
      selectedProjectId: 'objectId?',
    },
  };
}
