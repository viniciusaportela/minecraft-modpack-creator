import { useEffect, useState } from 'react';
import { Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { usePager } from '../../components/pager/hooks/usePager';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { ConfigLoader } from '../../core/domains/minecraft/config/ConfigLoader';
import { Launchers } from '../../core/domains/launchers/launchers';
import { useAppStore, useSelectedProject } from '../../store/app.store';
import { ProjectPreloader } from '../../core/domains/project/project-preloader';
import ProjectService from '../../core/domains/project/project-service';
import { useProjectSelector } from '../../store/hooks/use-project-store';

export default function ProjectPreload() {
  const handleError = useErrorHandler();
  const { navigate } = usePager();

  const project = useSelectedProject();

  const [hasLoaded, setHasLoaded] = useState(false);
  const hasProjectLoaded = useProjectSelector((st) => st.loaded);

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

        useAppStore.setState((st) => {
          st.configs = configs;
        });

        // Check if metadata is loaded, if not show instructions
        const launcher = Launchers.getInstance().getLauncherByName(
          project.launcher,
        );

        const dir = launcher.toDirectory(project.path);

        const metadata = await dir.getMetadata();

        if (!metadata) {
          navigate('waiting-for-data');
          return;
        }

        await ProjectPreloader.getInstance().load(project);

        useAppStore.setState((st) => {
          const projectDraft = st.projects[st.selectedProjectIndex];

          projectDraft.modCount = metadata.modCount;
          projectDraft.loader = metadata.modLoader;
          projectDraft.loaderVersion = metadata.loaderVersion;
          projectDraft.minecraftVersion = metadata.minecraftVersion;
          projectDraft.isLoaded = true;
        });

        setHasLoaded(true);
      } else {
        throw new Error('Project is undefined on ProjectPreload');
      }
    } catch (err) {
      if (err instanceof Error) {
        await handleError(err);
      }

      ProjectService.getInstance().unselectProject();
      navigate('projects');
    }
  }

  useEffect(() => {
    if (hasProjectLoaded && hasLoaded) {
      navigate('project');
    }
  }, [hasProjectLoaded, hasLoaded]);

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-5 pt-0">
      <span id="progress-text" className="mb-2">
        Loading...
      </span>
      <Progress isIndeterminate size="sm" />
    </div>
  );
}
