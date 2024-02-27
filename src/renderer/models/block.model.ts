const Realm = window.require('realm');

export class BlockModel extends Realm.Object {
  static schema = {
    name: 'Block',
    properties: {
      _id: 'objectId',
      id: 'string',
      name: 'string',
      model: 'string',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'blocks',
      },
    },
  };
}
