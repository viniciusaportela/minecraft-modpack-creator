import { useEffect, useRef, useState } from 'react';
import { Progress } from '@nextui-org/react';
import * as crypto from 'crypto';
import { ipcRenderer } from 'electron';
import path from 'path';
import { mkdir } from 'node:fs/promises';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import AppBarHeader from '../../components/app-bar/AppBarHeader';
import JarLoader from '../../core/minecraft/jar-loader';
import { useRealm } from '../../store/realm.context';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { CurseDirectory } from '../../core/minecraft/directory/curse-directory';
import { JarHandler } from '../../core/minecraft/jarHandler';

export default function ProjectPreload() {
  const realm = useRealm();
  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const progressTextRef = useRef(null);
  const [isInderterminate, setIsInderterminate] = useState(true);
  const [totalProgress, setTotalProgress] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    loadProject();
    ipcRenderer.send('resize', 400, 150);
    ipcRenderer.send('make-no-resizable');

    return () => {
      ipcRenderer.send('make-resizable');
    };
  }, []);

  async function loadProject() {
    try {
      if (project) {
        if (project.loaded) {
          navigate('project');
        } else {
          setIsInderterminate(false);

          const directory = new CurseDirectory(project.path);
          const mods = await directory.getModJarPaths();
          const shaHash = crypto.createHash('sha1');
          shaHash.update(
            mods.reduce((finalStr, modFile) => finalStr + modFile, ''),
          );
          const modsChecksum = shaHash.digest('hex');
          console.log('generated modsChecksum', modsChecksum);

          setTotalProgress(mods.length);

          realm.beginTransaction();
          project.modsChecksum = modsChecksum;

          const minecraftMod = project.mods?.find(
            (m) => m.modId === 'minecraft',
          );

          console.log(project.path, minecraftMod?.toJSON());
          if (!minecraftMod) {
            const minecraftJarPath = await directory.getMinecraftJarPath();
            console.log(minecraftJarPath);

            // load everything for minecraft jar
            const minecraftJar = await JarLoader.load(minecraftJarPath);

            const handler = new JarHandler(minecraftJar, project, realm);

            await handler.handleTextures();
            // await handler.handleItems();
            // await handler.handleBlocks();

            // await minecraftJar.processBlocks();

            // const createdMinecraftMod = realm.create(ModModel, {
            //   jarPath: `${project.path}/mods/minecraft.jar`,
            //   project,
            //   modId: 'minecraft',
            //   name: 'Minecraft',
            //   config: '{}',
            //   version: project.minecraftVersion,
            //   dependencies: [],
            // });
            //
            // project.mods!.push(createdMinecraftMod);
          }

          console.log('project.mods', project.mods);

          const migratedMods = project.mods!;

          // const migratedMods = realm
          //   .objects(ModModel)
          //   .filtered('project = $0', project);

          const allMods = await directory.getModJarPaths();

          console.log(allMods);

          const modsToMigrate = allMods.filter(
            (modPath) =>
              migratedMods.find((m) => path.basename(m.jarPath) === modPath) ===
              undefined,
          );
          console.log('modsToMigrate', modsToMigrate);

          // go for each mod, verify if already registered

          for await (const modFile of mods) {
            // const jar = await JarLoader.load(modFile);
            //
            // const metadata = await jar.getMetadata();
            //
            // console.log(metadata);
            //
            // const { modId } = metadata.mods[0];
            //
            // const createdMod = realm.create(ModModel, {
            //   jarPath: modFile,
            //   project,
            //   modId,
            //   name: metadata.mods[0].displayName,
            //   dependencies: metadata.dependencies[modId]
            //     .filter((d) => d.mandatory)
            //     .map((d) => d.modId),
            //   // TODO add category
            // });
            //
            // project.mods!.push(createdMod);
            // await loadJarFiles(jar);
          }

          realm.commitTransaction();

          // navigate('project');
        }
      } else {
        console.warn('Project is undefined');
      }
    } catch (err) {
      console.error(err?.stack);
      if (realm.isInTransaction) realm.cancelTransaction();
    }
  }

  async function loadJarFiles(jar: JarLoader) {
    // load textures
    // load items
    // load blocks

    setCurrentProgress((cur) => cur + 1);
  }

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-5 pt-0">
      <AppBarHeader title="My Projects" goBack={null}>
        {null}
      </AppBarHeader>
      <span id="progress-text" className="mb-2" ref={progressTextRef}>
        Loading...
      </span>
      <Progress isIndeterminate={isInderterminate} size="sm" />
    </div>
  );
}
