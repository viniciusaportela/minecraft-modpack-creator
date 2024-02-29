import Realm, { BSON, ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class BlockModel extends Realm.Object {
  _id!: BSON.ObjectId;

  id!: string;

  name!: string;

  model!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Block',
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
        property: 'blocks',
      },
    },
    primaryKey: '_id',
  };
}
