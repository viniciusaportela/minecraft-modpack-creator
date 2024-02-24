import React, { useEffect, useState } from 'react';
import { IProjectMeta } from '../../typings/project-meta.interface';
import { usePage } from '../../context/page.context';
import { useProject } from '../../context/project.context';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';

export default function Projects() {
  const { setPage } = usePage();
  const { setProject } = useProject();
  const [projects, setProjects] = useState<any[]>([]);

  const loadProjects = async () => {
    const curseFolder = await window.ipcRenderer.invoke('getCurseForgeFolder');

    if (curseFolder) {
      try {
        const folder = await window.ipcRenderer.invoke('readDir', curseFolder);
        console.log(folder);
        setProjects(
          folder.map((folder: string) => ({
            name: folder,
            path: `${curseFolder}/${folder}`,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const open = (path: string, metadata: IProjectMeta | null) => {
    setPage('project');
    console.log(window.ipcRenderer);
    window.ipcRenderer.send('on-open-project');
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
        <ProjectCard title={p.name} path={p.path} onOpen={open} />
      ))}
    </div>
  );
}
