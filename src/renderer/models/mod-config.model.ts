const Realm = window.require('realm');

export class ModConfigModel extends Realm.Object {
  static schema = {
    name: 'Mod',
    properties: {
      _id: 'objectId',
      modId: 'string',
      version: 'string',
      name: 'string',
      jarPath: 'string',
      category: 'string',
      config: 'string',
      dependencies: 'string[]',
      project: {
        type: 'linkingObjects',
        objectType: 'Project',
        property: 'mods',
      },
    },
  };
}
