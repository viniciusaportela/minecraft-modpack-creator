import { useEffect, useRef, useState } from 'react';
import { Progress } from '@nextui-org/react';
import { ipcRenderer } from 'electron';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import AppBarHeader from '../../components/app-bar/AppBarHeader';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { useAppStore } from '../../store/app.store';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { ProjectPreloader } from '../../core/domains/project/project-preloader';

export default function ProjectPreload() {
  const handleError = useErrorHandler();
  const realm = useAppStore((st) => st.realm);
  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const progressTextRef = useRef<HTMLSpanElement>(null);
  const [isInderterminate, setIsInderterminate] = useState(true);
  const [totalProgress, setTotalProgress] = useState(1);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    loadProject().catch((err) => console.log(err));
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
          const preloader = new ProjectPreloader(project);

          preloader.onProgress(({ totalProgress, text }) => {
            if (totalProgress) {
              setCurrentProgress(0);
              setIsInderterminate(false);
              setTotalProgress(totalProgress);
            } else {
              setCurrentProgress((progress) => progress + 1);
              if (text) progressTextRef.current!.innerText = text;
            }
          });

          await preloader.preload();

          navigate('project');
        }
      } else {
        throw new Error('Project is undefined on ProjectPreload');
      }
    } catch (err) {
      console.log(err.stack);
      await handleError(err);
      if (realm.isInTransaction) realm.cancelTransaction();
      realm.write(() => {
        globalState.selectedProjectId = undefined;
      });
      navigate('projects');
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
