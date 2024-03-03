import Realm, { BSON, ObjectSchema, Types } from 'realm';

export class TextureModel extends Realm.Object {
  _id!: BSON.ObjectId;

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
      _id: {
        type: 'objectId',
        default: () => new BSON.ObjectId(),
      },
      textureId: {
        type: 'string',
        indexed: true,
      },
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
    primaryKey: '_id',
  };
}
