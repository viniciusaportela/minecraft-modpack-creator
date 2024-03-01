import Realm, { ObjectSchema } from 'realm';
import { ProjectModel } from './project.model';

export class TextureModel extends Realm.Object {
  textureId!: string;

  name!: string;

  path!: string;

  type!: string;

  project!: ProjectModel;

  static schema: ObjectSchema = {
    name: 'Texture',
    properties: {
      textureId: 'string',
      name: 'string',
      path: 'string',
      type: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'textures',
      },
    },
    primaryKey: 'textureId',
  };
}
