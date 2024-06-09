import { useEffect } from 'react';
import { Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { usePager } from '../../components/pager/hooks/usePager';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { ConfigLoader } from '../../core/domains/minecraft/config/ConfigLoader';
import { Launchers } from '../../core/domains/launchers/launchers';
import { useAppStore, useSelectedProject } from '../../store/app.store';
import { ProjectPreloader } from '../../core/domains/project/project-preloader';
import ProjectService from '../../core/domains/project/project-service';

export default function ProjectPreload() {
  const handleError = useErrorHandler();
  const { navigate } = usePager();

  const idx = useAppStore((st) => st.selectedProjectIndex);
  const project = useSelectedProject();

  console.log('project/idx', project, idx);

  useEffect(() => {
    loadProject().catch((err) => console.error(err));
    ipcRenderer.send('resize', 400, 150);
    ipcRenderer.send('make-no-resizable');

    return () => {
      ipcRenderer.send('make-resizable');
    };
  }, []);

  useEffect(() => {
    console.log('idx changed', idx);
  }, [idx]);

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
        console.log(metadata);

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

        navigate('project');
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

  return (
    <div className="flex-1 flex flex-col justify-center h-full p-5 pt-0">
      <span id="progress-text" className="mb-2">
        Loading...
      </span>
      <Progress isIndeterminate size="sm" />
    </div>
  );
}
