import Realm, { ObjectSchema, Types } from 'realm';

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
      blockId: 'string',
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
    primaryKey: 'blockId',
  };
}
