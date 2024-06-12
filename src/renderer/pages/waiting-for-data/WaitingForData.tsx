import { Code, Link, Spinner } from '@nextui-org/react';
import React, { useCallback, useLayoutEffect } from 'react';
import { ipcRenderer, shell } from 'electron';
import path from 'node:path';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import { useSelectedProject } from '../../store/app.store';
import { usePager } from '../../components/pager/hooks/usePager';
import ProjectService from '../../core/domains/project/project-service';

export default function WaitingForData() {
  const { navigate } = usePager();
  const project = useSelectedProject();

  const metadataCreatedCallback = useCallback(() => {
    ipcRenderer.removeListener('on-metadata-found', metadataCreatedCallback);
    navigate('project-preload');
  }, []);

  useLayoutEffect(() => {
    ipcRenderer.send('resize', 800, 350);

    ipcRenderer.on('on-metadata-found', metadataCreatedCallback);

    ipcRenderer.send('watchMetadata', project!.path, 'on-metadata-found');
  }, []);

  const openModsFolder = () => {
    shell.openPath(`${project!.path}${path.sep}mods`);
  };

  return (
    <>
      <AppBarHeader
        title="Minecraft Toolkit"
        goBack={() => {
          ProjectService.getInstance().unselectProject();
          navigate('projects');
        }}
      >
        <AppBarHeaderContainer>
          <div className="flex-1 app-bar-drag h-full" />
        </AppBarHeaderContainer>
      </AppBarHeader>
      <div className="p-3">
        <h1 className="text-2xl font-bold">
          First Steps for "{project?.name}"
        </h1>
        <span className="mb-2 flex">
          You're almost there, but first we need to get data from the game, so
          we can list the mods, configurations, items, etc. For that:
        </span>

        <ol>
          <li>
            1. Download the{' '}
            <Link
              href="#"
              onPress={() => {
                shell.openExternal(
                  'https://github.com/viniciusaportela/minecraft-toolkit-mod/releases',
                );
              }}
            >
              Minecraft Toolkit Mod
            </Link>
          </li>
          <li>
            2. Place the downloaded mod on the{' '}
            <Link onPress={openModsFolder} href="#">
              Mods Folder
            </Link>
          </li>
          <li>3. Open this profile/instance on the launcher</li>
          <li>4. Join on any of your worlds or create a new one</li>
          <li>
            5. Run the command <Code>/toolkit-mod dump</Code>
          </li>
          <div className="flex items-center justify-center rounded-md bg-zinc-700 p-2 gap-4 mt-4">
            <span>Waiting for data to be generated...</span>
            <Spinner />
          </div>
        </ol>
      </div>
    </>
  );
}
