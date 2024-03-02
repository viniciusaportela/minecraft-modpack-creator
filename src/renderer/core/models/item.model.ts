import Realm, { ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class ItemModel extends Realm.Object {
  id!: string;

  name!: string;

  model!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Item',
    properties: {
      id: 'string',
      name: 'string',
      model: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'items',
      },
    },
    primaryKey: 'id',
  };
}
