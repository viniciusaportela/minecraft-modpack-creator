import crypto from 'crypto';
import Realm from 'realm';
import { CurseDirectory } from '../minecraft/directory/curse-directory';
import JarLoader from '../minecraft/jar-loader';
import { JarHandler } from '../minecraft/jar-handler';
import { ModModel } from '../../models/mod.model';
import { ModPreloaderFactory } from '../../mods/preloaders/mod-preloader-factory';
import { ProjectModel } from '../../models/project.model';

export class ProjectPreloader {
  private onProgressCb?: (progress: {
    totalProgress?: number;
    text?: string;
  }) => void;

  constructor(
    private readonly realm: Realm,
    private readonly project: ProjectModel,
  ) {}

  onProgress(
    cb: (progress: { totalProgress?: number; text?: string }) => void,
  ) {
    this.onProgressCb = cb;
    return this;
  }

  async preload() {
    const directory = new CurseDirectory(this.project.path);
    const dirMods = await directory.getModJarPaths();

    this.onProgressCb?.({ totalProgress: (dirMods.length + 1) * 3 });

    this.realm.beginTransaction();
    const shaHash = crypto.createHash('sha1');
    shaHash.update(
      dirMods.reduce((finalStr, modFile) => finalStr + modFile, ''),
    );
    this.project.modsChecksum = shaHash.digest('hex');
    this.realm.commitTransaction();

    const minecraftJarPath = await directory.getMinecraftJarPath();
    dirMods.push(minecraftJarPath);

    for await (const modFile of dirMods) {
      const jar = await JarLoader.load(modFile);

      const modId = await this.getModId(jar);

      const modDb = await this.getModInDb(modFile, jar);

      const handler = new JarHandler(jar, this.project, this.realm, modDb);

      const uppercaseModId = modId.charAt(0).toUpperCase() + modId.slice(1);

      this.realm.beginTransaction();
      this.onProgressCb?.({ text: `${uppercaseModId}: Loading textures...` });
      await handler.handleTextures();
      this.realm.commitTransaction();

      this.realm.beginTransaction();
      this.onProgressCb?.({ text: `${uppercaseModId}: Loading items...` });
      await handler.handleItems();
      this.realm.commitTransaction();

      this.realm.beginTransaction();
      this.onProgressCb?.({ text: `${uppercaseModId}: Loading blocks...` });
      await handler.handleBlocks();
      this.realm.commitTransaction();
    }

    this.realm.beginTransaction();
    this.project.loaded = true;
    this.realm.commitTransaction();
  }

  private async getModId(jar: JarLoader) {
    if (await jar.isMinecraft()) {
      return 'minecraft';
    }

    const metadata = await jar.getMetadata();
    if (metadata) {
      return metadata.mods[0].modId;
    }

    return 'unknown';
  }

  private async getModInDb(modFile: string, jar: JarLoader) {
    const modId = await this.getModId(jar);
    const mod = ModPreloaderFactory.create(jar, modId);
    const metadata = await jar.getMetadata();

    const foundMod = this.realm
      .objects<ModModel>(ModModel.schema.name)
      .filtered('project = $0 AND jarPath = $1', this.project._id, modFile);

    if (foundMod.length > 0) {
      return foundMod[0];
    }

    this.realm.beginTransaction();
    const created = this.realm.create<ModModel>(ModModel.schema.name, {
      jarPath: modFile,
      modId,
      name: metadata ? metadata.mods[0].displayName : 'Minecraft',
      // TODO has to consider case where version is gotten from MANIFEST.MF
      version: metadata
        ? metadata.mods[0].version
        : this.project.minecraftVersion,
      config: JSON.stringify(await mod.generateConfig()),
      project: this.project._id,
      dependencies: metadata?.dependencies?.[modId]
        ? metadata.dependencies[modId]
            .filter((d) => d.mandatory)
            .map((d) => d.modId)
        : [],
      // TODO add category
    });
    this.realm.commitTransaction();
    return created;
  }
}
