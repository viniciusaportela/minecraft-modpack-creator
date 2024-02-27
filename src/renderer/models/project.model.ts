const Realm = window.require('realm');

export class ProjectModel extends Realm.Object {
  static schema = {
    name: 'Project',
    properties: {
      _id: 'objectId',
      name: 'string',
      path: 'string',
      minecraftVersion: 'string',
      loaderVersion: 'string',
      loader: 'string',
      hasMigrated: 'bool',
      version: 'int',
      modsChecksum: 'string',
      textures: 'Texture[]',
      items: 'Item[]',
      blocks: 'Block[]',
      mods: 'Mod[]',
    },
  };
}
