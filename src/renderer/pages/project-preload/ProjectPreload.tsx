import { useEffect, useRef, useState } from 'react';
import { Progress } from '@nextui-org/react';
import * as crypto from 'crypto';
import { ipcRenderer } from 'electron';
import path from 'path';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import AppBarHeader from '../../components/app-bar/AppBarHeader';
import JarLoader from '../../core/minecraft/jar-loader';
import { useRealm } from '../../store/realm.context';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { CurseDirectory } from '../../core/minecraft/directory/curse-directory';
import { JarHandler } from '../../core/minecraft/jar-handler';
import { ModModel } from '../../core/models/mod.model';
import { ModsFactory } from '../../core/mods/mods-factory';

export default function ProjectPreload() {
  const realm = useRealm();
  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const progressTextRef = useRef<HTMLSpanElement>(null);
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

          setTotalProgress(mods.length);

          realm.beginTransaction();
          project.modsChecksum = modsChecksum;

          const minecraftMod = project.mods?.find(
            (m) => m.modId === 'minecraft',
          );

          if (!minecraftMod) {
            const minecraftJarPath = await directory.getMinecraftJarPath();

            const minecraftJar = await JarLoader.load(minecraftJarPath);

            const handler = new JarHandler(minecraftJar, project, realm);

            progressTextRef.current!.innerText =
              'Minecraft: Loading textures...';
            await handler.handleTextures();
            progressTextRef.current!.innerText = 'Minecraft: Loading items...';
            await handler.handleItems();
            progressTextRef.current!.innerText = 'Minecraft: Loading blocks...';
            await handler.handleBlocks();

            const createdMinecraftMod = realm.create(ModModel, {
              jarPath: `${project.path}/mods/minecraft.jar`,
              project,
              modId: 'minecraft',
              name: 'Minecraft',
              config: '{}',
              version: project.minecraftVersion,
              dependencies: [],
            });

            project.mods!.push(createdMinecraftMod);
          }

          realm.commitTransaction();

          const migratedMods = project.mods!;
          const allMods = await directory.getModJarPaths();

          const modsToMigrate = allMods.filter(
            (modPath) =>
              migratedMods.find((m) => path.basename(m.jarPath) === modPath) ===
              undefined,
          );
          console.log('modsToMigrate', modsToMigrate);

          for await (const modFile of modsToMigrate) {
            const jar = await JarLoader.load(modFile);

            const handler = new JarHandler(jar, project, realm);

            const metadata = await jar.getMetadata();
            const { modId } = metadata.mods[0];
            const formattedModId =
              modId.charAt(0).toUpperCase() + modId.slice(1);

            progressTextRef.current!.innerText = `${formattedModId}: Loading textures...`;
            await handler.handleTextures();

            realm.beginTransaction();
            progressTextRef.current!.innerText = `${formattedModId}: Loading items...`;
            await handler.handleItems();
            progressTextRef.current!.innerText = `${formattedModId}: Loading blocks...`;
            await handler.handleBlocks();
            realm.commitTransaction();

            const mod = ModsFactory.create(jar, metadata.mods[0].modId);

            realm.beginTransaction();
            const createdMod = realm.create<ModModel>(ModModel.schema.name, {
              jarPath: modFile,
              project,
              modId: metadata.mods[0].modId,
              name: metadata.mods[0].displayName,
              // TODO has to consider case where version is gotten from MANIFEST.MF
              version: metadata.mods[0].version,
              config: JSON.stringify(await mod.generateConfig()),
              dependencies:
                metadata.dependencies?.[modId]
                  .filter((d) => d.mandatory)
                  .map((d) => d.modId) || [],
              // TODO add category
            });

            project.mods!.push(createdMod);
            realm.commitTransaction();

            setCurrentProgress((prev) => prev + 1);
          }

          realm.beginTransaction();

          project.loaded = true;

          realm.commitTransaction();

          navigate('project');
        }
      } else {
        console.warn('Project is undefined');
      }
    } catch (err) {
      console.error(err?.stack);
      if (realm.isInTransaction) realm.cancelTransaction();
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-5 pt-0">
      <AppBarHeader title="My Projects" goBack={null}>
        {null}
      </AppBarHeader>
      <span id="progress-text" className="mb-2" ref={progressTextRef}>
        Loading...
      </span>
      <Progress
        isIndeterminate={isInderterminate}
        size="sm"
        value={(currentProgress / totalProgress) * 100}
      />
    </div>
  );
}
