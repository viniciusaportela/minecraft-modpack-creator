import { useEffect } from 'react';
import { Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { mkdir, stat } from 'node:fs/promises';
import path from 'path';
import { usePager } from '../../components/pager/hooks/usePager';
import { useAppStore } from '../../store/app.store';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { ConfigLoader } from '../../core/domains/minecraft/config/ConfigLoader';
import { Launchers } from '../../core/domains/launchers/launchers';

export default function ProjectPreload() {
  const handleError = useErrorHandler();
  const { navigate } = usePager();

  const project = useAppStore((st) => st.selectedProject);

  useEffect(() => {
    loadProject().catch((err) => console.error(err));
    ipcRenderer.send('resize', 400, 150);
    ipcRenderer.send('make-no-resizable');

    return () => {
      ipcRenderer.send('make-resizable');
    };
  }, []);

  async function loadProject() {
    try {
      if (project) {
        const configLoader = new ConfigLoader(project);
        const configs = await configLoader.load();
        useAppStore.setState({ configs });

        if (project.isLoaded) {
          navigate('project');
        } else {
          // Check if metadata is loaded, if not show instructions
          const launcher = Launchers.getInstance().getLauncherByName(
            project.launcher,
          );

          const dir = launcher.toDirectory(project.path);

          const metadata = await dir.getMetadata();
          console.log(metadata);

          if (!metadata) {
            navigate('waiting-for-data');
            return;
          }

          project.isLoaded = true;
          useAppStore.getState().setProject(project);

          navigate('project');
        }
      } else {
        throw new Error('Project is undefined on ProjectPreload');
      }
    } catch (err) {
      if (err instanceof Error) {
        await handleError(err);
      }

      useAppStore.setState({ selectedProject: null });
      navigate('projects');
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-5 pt-0">
      <span id="progress-text" className="mb-2">
        Loading...
      </span>
      <Progress isIndeterminate size="sm" />
    </div>
  );
}
