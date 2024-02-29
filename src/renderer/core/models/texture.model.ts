import Realm, { BSON, ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class TextureModel extends Realm.Object {
  _id!: BSON.ObjectId;

  name!: string;

  path!: string;

  type!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Texture',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectId(),
      },
      name: 'string',
      path: 'string',
      type: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'textures',
      },
    },
    primaryKey: '_id',
  };
}
