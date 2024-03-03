import Realm, { ObjectSchema, Types } from 'realm';

export class TextureModel extends Realm.Object {
  textureId!: string;

  path!: string;

  prefix!: string;

  project!: Types.ObjectId;

  mod!: Types.ObjectId;

  getName() {
    return this.path.split('/').pop();
  }

  static schema: ObjectSchema = {
    name: 'Texture',
    properties: {
      textureId: 'string',
      path: 'string',
      mod: {
        indexed: true,
        type: 'objectId',
      },
      prefix: 'string',
      project: {
        indexed: true,
        type: 'objectId',
      },
    },
    primaryKey: 'textureId',
  };
}
