import Realm, { ObjectSchema, Types } from 'realm';

export class ItemModel extends Realm.Object {
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
      itemId: 'string',
      name: 'string',
      modelJson: 'string',
      project: {
        type: 'objectId',
        indexed: true,
      },
    },
    primaryKey: 'itemId',
  };
}
