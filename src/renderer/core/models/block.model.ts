import Realm, { ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class BlockModel extends Realm.Object {
  id!: string;

  name!: string;

  model!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Block',
    properties: {
      id: 'string',
      name: 'string',
      model: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'blocks',
      },
    },
    primaryKey: 'id',
  };
}
