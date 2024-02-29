import Realm, { BSON, ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class ItemModel extends Realm.Object {
  _id!: BSON.ObjectId;

  name!: string;

  model!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Item',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectId(),
      },
      id: 'string',
      name: 'string',
      model: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'items',
      },
    },
    primaryKey: '_id',
  };
}
