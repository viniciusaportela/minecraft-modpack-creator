import crypto from 'crypto';
import Realm from 'realm';
import JarLoader from '../minecraft/jar-loader';
import { JarHandler } from '../minecraft/jar-handler';
import { ModModel } from '../../models/mod.model';
import { ModPreloaderFactory } from '../mods/preloaders/mod-preloader-factory';
import { ProjectModel } from '../../models/project.model';
import { ModConfigModel } from '../../models/mod-config.model';
import { Launchers } from '../launchers/launchers';
import { useAppStore } from '../../../store/app.store';
import { BaseLauncher } from '../launchers/base/base-launcher';
import { BaseMetadata } from '../launchers/base/base-metadata';

export class ProjectPreloader {
  private onProgressCb?: (progress: {
    totalProgress?: number;
    text?: string;
  }) => void;

  private readonly realm: Realm;

  private launcher!: BaseLauncher;

  constructor(private readonly project: ProjectModel) {
    const { realm } = useAppStore.getState();
    this.realm = realm;
  }

  onProgress(
    cb: (progress: { totalProgress?: number; text?: string }) => void,
  ) {
    this.onProgressCb = cb;
    return this;
  }

  async preload() {
    this.launcher = (await Launchers.getByFolder(
      this.project.path,
    )) as BaseLauncher;
    const directory = this.launcher?.getDirectory(this.project.path);

    if (!directory) {
      throw new Error("Couldn't find the Launcher for this folder");
    }

    const modPaths = await directory.getAllModPaths();
    const STEPS_PER_MOD = 3;
    this.onProgressCb?.({
      totalProgress: (modPaths.length + 1) * STEPS_PER_MOD,
    });

    this.updateModsChecksum(modPaths);

    const minecraftJarPath = await directory.getMinecraftJarPath();
    modPaths.push(minecraftJarPath);

    for await (const modFile of modPaths) {
      const jar = await JarLoader.load(modFile);

      const modId = await jar.getModId();

      const projectMetadata = await this.launcher
        .getDirectory(this.project.path)
        .readMetadata();
      const modDb = await this.getModInDb(projectMetadata, jar);

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

  private updateModsChecksum(modPaths: string[]) {
    this.realm.beginTransaction();
    const shaHash = crypto.createHash('sha1');
    shaHash.update(
      modPaths.reduce((finalStr, modFile) => finalStr + modFile, ''),
    );
    this.project.modsChecksum = shaHash.digest('hex');
    this.realm.commitTransaction();
  }

  private async getModInDb(projectMetadata: BaseMetadata, jar: JarLoader) {
    const modId = await jar.getModId();
    const modPreloader = await ModPreloaderFactory.create(jar);
    const metadata = await jar.getMetadata();

    const foundMod = this.realm
      .objects<ModModel>(ModModel.schema.name)
      .filtered('project = $0 AND jarPath = $1', this.project._id, jar.jarPath);

    if (foundMod.length > 0) {
      return foundMod[0];
    }

    console.log('modId', modId);
    const modMetadata = await projectMetadata.getModMetadata(jar);
    console.log('modMetadata', modMetadata);

    this.realm.beginTransaction();
    const created = this.realm.create<ModModel>(ModModel.schema.name, {
      jarPath: jar.jarPath,
      modId,
      name: metadata ? metadata.mods[0].displayName : 'Minecraft',
      // TODO has to consider case where version is gotten from MANIFEST.MF
      version: metadata
        ? metadata.mods[0].version
        : this.project.minecraftVersion,
      project: this.project._id,
      thumbnail: modMetadata.getThumbnail() ?? undefined,
      website: modMetadata.getWebsite() ?? undefined,
      dependencies: metadata?.dependencies?.[modId]
        ? metadata.dependencies[modId]
            .filter((d) => d.mandatory)
            .map((d) => d.modId)
        : [],
    });

    this.realm.create(ModConfigModel.schema.name, {
      json: JSON.stringify(await modPreloader.generateConfig()),
      mod: created._id,
    });
    this.realm.commitTransaction();

    return created;
  }
}
