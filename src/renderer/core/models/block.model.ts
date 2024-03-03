import Realm, { BSON, ObjectSchema, Types } from 'realm';

export class BlockModel extends Realm.Object {
  blockId!: string;

  name!: string;

  modelJson!: string;

  mod!: Types.ObjectId;

  project!: Types.ObjectId;

  getModel() {
    return JSON.parse(this.modelJson);
  }

  static schema: ObjectSchema = {
    name: 'Block',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new BSON.ObjectId(),
      },
      blockId: {
        type: 'string',
        indexed: true,
      },
      name: 'string',
      modelJson: 'string',
      mod: {
        type: 'objectId',
        indexed: true,
      },
      project: {
        type: 'objectId',
        indexed: true,
      },
    },
    primaryKey: '_id',
  };
}
