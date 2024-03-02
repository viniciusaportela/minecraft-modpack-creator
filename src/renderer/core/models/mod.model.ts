import Realm, { BSON, ObjectSchema, Types } from 'realm';
import { ProjectModel } from './project.model';

export class ModModel extends Realm.Object {
  _id!: BSON.ObjectId;

  modId!: string;

  version!: string;

  name!: string;

  jarPath!: string;

  category?: string;

  config!: string;

  dependencies!: string[];

  tags!: string[];

  project!: ProjectModel;

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
      config: 'string',
      dependencies: 'string[]',
      tags: {
        type: 'list',
        objectType: 'string',
        default: [],
      },
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'mods',
      },
    },
    primaryKey: '_id',
  };
}
