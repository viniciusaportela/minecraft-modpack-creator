import type { ObjectSchema } from 'realm';

const Realm = window.require('realm');

export class TextureModel extends Realm.Object {
  static schema: ObjectSchema = {
    name: 'Texture',
    properties: {
      _id: 'objectId',
      name: 'string',
      path: 'string',
      type: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'textures',
      },
    },
  };
}
