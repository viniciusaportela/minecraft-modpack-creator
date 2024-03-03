import Realm, { BSON, ObjectSchema, Types } from 'realm';

export class ItemModel extends Realm.Object {
  _id!: BSON.ObjectId;

  itemId!: string;

  name!: string;

  modelJson!: string;

  project!: Types.ObjectId;

  getModel() {
    return JSON.parse(this.modelJson);
  }

  static schema: ObjectSchema = {
    name: 'Item',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new BSON.ObjectId(),
      },
      itemId: {
        type: 'string',
        indexed: true,
      },
      name: 'string',
      modelJson: 'string',
      project: {
        type: 'objectId',
        indexed: true,
      },
    },
    primaryKey: '_id',
  };
}
