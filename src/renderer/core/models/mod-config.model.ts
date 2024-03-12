import Realm, { BSON, ObjectSchema, Types } from 'realm';
import { useAppStore } from '../../store/app.store';

export class ModConfigModel extends Realm.Object {
  _id!: BSON.ObjectId;

  json!: string;

  mod!: Types.ObjectId;

  parseConfig() {
    return JSON.parse(this.json);
  }

  writeConfig(config: Record<string, unknown>) {
    const { realm } = useAppStore.getState();

    realm.write(() => {
      this.json = JSON.stringify(config);
    });
  }

  static schema: ObjectSchema = {
    name: 'ModConfig',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectId(),
      },
      json: 'string',
      mod: {
        type: 'objectId',
        indexed: true,
      },
    },
    primaryKey: '_id',
  };
}
