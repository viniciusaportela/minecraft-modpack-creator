import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ipcRenderer } from 'electron';
import { IProjectMeta } from '../../typings/project-meta.interface';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';
import { useAppStore } from '../../store/app.store';
import { readConfigFromModpack } from '../../store/project.store';
import { usePager } from '../../components/pager/hooks/usePager';

export default function Projects() {
  const { navigate } = usePager();
  const { setGoBack, setProject, setTitle, setCustomRightElement } =
    useAppStore(
      useShallow((st) => ({
        setGoBack: st.setGoBack,
        setProject: st.setProjectMeta,
        setTitle: st.setTitle,
        setCustomRightElement: st.setCustomRightElement,
      })),
    );
  const [projects, setProjects] = useState<any[]>([]);

  useLayoutEffect(() => {
    setTitle('My Projects');
    setGoBack(null);
    setCustomRightElement(null);
  }, []);

  useEffect(() => {}, []);

  const loadProjects = async () => {
    const curseFolder = await ipcRenderer.invoke('getCurseForgeFolder');

    if (curseFolder) {
      try {
        const folder = await ipcRenderer.invoke('readDir', curseFolder);
        setProjects(
          folder.map((f: string) => ({
            name: f,
            path: `${curseFolder}/${f}`,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const open = async (path: string, metadata: IProjectMeta | null) => {
    await readConfigFromModpack(path);
    navigate('project');
    ipcRenderer.send('on-open-project');
    if (metadata) {
      setProject(metadata);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 p-5 overflow-y-auto">
      <AddProject />
      {projects.map((p) => (
        <ProjectCard title={p.name} path={p.path} key={p.name} onOpen={open} />
      ))}
    </div>
  );
}
