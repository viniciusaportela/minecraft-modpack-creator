import Realm, { BSON, ObjectSchema, Types } from 'realm';
import { useAppStore } from '../../store/app.store';
import { BlockModel } from './block.model';

export class ItemModel extends Realm.Object {
  _id!: BSON.ObjectId;

  itemId!: string;

  name!: string;

  modelJson!: string;

  project!: Types.ObjectId;

  getModel() {
    return JSON.parse(this.modelJson);
  }

  getParent() {
    const model = this.getModel();

    const [modId, entityId] = model.parent.split(':');
    const [entityType, ...realId] = entityId.split('/');

    const { realm } = useAppStore.getState();
    const parent = realm
      .objects<
        ItemModel | BlockModel
      >(entityType === 'block' ? BlockModel.schema.name : ItemModel.schema.name)
      .filtered(
        entityType === 'block' ? 'blockId = $0' : 'itemId = $0',
        `${modId}:${realId.join('/')}`,
      )[0];

    if (parent) {
      return parent.getModel();
    }

    return undefined;
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
