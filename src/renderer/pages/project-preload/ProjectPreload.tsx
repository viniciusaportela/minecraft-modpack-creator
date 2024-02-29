import { useEffect, useRef, useState } from 'react';
import { Progress } from '@nextui-org/react';
import * as crypto from 'crypto';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import AppBarHeader from '../../components/app-bar/AppBarHeader';
import JarLoader from '../../core/minecraft/jar-loader';
import { useRealm } from '../../store/realm.context';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { MinecraftDirectory } from '../../core/minecraft/minecraft-directory';
import { ModModel } from '../../core/models/mod.model';

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
  }, []);

  async function loadProject() {
    if (project) {
      if (project.loaded) {
        navigate('project');
      } else {
        setIsInderterminate(false);

        const mods = await new MinecraftDirectory(project.path).getModJars();
        const shaHash = crypto.createHash('sha1');
        shaHash.update(
          mods.reduce((finalStr, modFile) => finalStr + modFile, ''),
        );
        const modsChecksum = shaHash.digest('hex');

        realm.write(() => {
          const project = realm.objectForPrimaryKey(
            ProjectModel,
            globalState.selectedProjectId!,
          )!;
          project.modsChecksum = modsChecksum;
        });

        setTotalProgress(mods.length);

        // TODO load minecraft jar too
        realm.write(() => {
          // check if already exists
          // create
        });
        // await loadJarFiles();

        for await (const modFile of mods) {
          const jar = await JarLoader.load(modFile);

          const metadata = await jar.getMetadata();

          let createdMod: ModModel = null as unknown as ModModel;
          realm.write(() => {
            createdMod = realm.create(ModModel, {
              jarPath: modFile,
              project,
              modId: metadata.mods.modId,
              name: metadata.mods.displayName,
              dependencies: metadata.dependencies
                .filter((d) => d.mandatory)
                .map((d) => d.modId),
              // TODO add category
            });
          });

          await loadJarFiles(jar);
        }

        // navigate('project');
      }
    } else {
      console.warn('Project is undefined');
    }
  }

  async function loadJarFiles(jar: JarLoader) {
    // load textures
    // load items
    // load blocks

    setCurrentProgress((cur) => cur + 1);
  }

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-20">
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
