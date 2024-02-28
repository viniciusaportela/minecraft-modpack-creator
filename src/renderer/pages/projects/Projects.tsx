import React, { useEffect, useLayoutEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ipcRenderer } from 'electron';
import { readFile } from 'node:fs/promises';
import Realm from 'realm';
import { IProjectMeta } from '../../typings/project-meta.interface';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';
import { useAppStore } from '../../store/app.store';
import { readConfigFromModpack } from '../../store/project.store';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQuery } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import { useRealm } from '../../store/realm.context';
import { GlobalStateModel } from '../../core/models/global-state.model';

export default function Projects() {
  const realm = useRealm();
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

  const projects = useQuery<ProjectModel>('Project');
  const globalState = useQuery(GlobalStateModel.schema.name)[0];
  console.log('projects', projects);
  console.log('globalState', globalState);

  useLayoutEffect(() => {
    setTitle('My Projects');
    setGoBack(null);
    setCustomRightElement(null);
  }, []);

  useEffect(() => {
    loadProjects().catch(console.error);
  }, []);

  const loadProjectMeta = async (curseFolder: string, modpackName: string) => {
    console.log('read');
    const curseInstanceJson = await readFile(
      `${curseFolder}/${modpackName}/minecraftinstance.json`,
      'utf-8',
    );

    const curseInstance = JSON.parse(curseInstanceJson);

    realm.write(() => {
      realm.create(
        ProjectModel.schema.name,
        {
          name: modpackName,
          path: `${curseFolder}/${modpackName}/`,
          minecraftVersion: curseInstance.gameVersion,
          loaderVersion: curseInstance.baseModLoader.name,
          loader: curseInstance.baseModLoader.name,
          fromCurseForge: true,
          loaded: false,
          version: 1,
        },
        Realm.UpdateMode.Modified,
      );
    });
  };

  const loadProjects = async () => {
    const curseFolder = await ipcRenderer.invoke('getCurseForgeFolder');

    if (curseFolder) {
      try {
        const folders = await ipcRenderer.invoke('readDir', curseFolder);
        const promises = folders.map((f: string) =>
          loadProjectMeta(curseFolder, f),
        );
        await Promise.all(promises);
      } catch (err) {
        console.error(err);
      }
    }

    realm.write(() => {
      realm
        .objects(GlobalStateModel.schema.name)
        .update('hasCheckedForCurseForge', true);
    });
  };

  const open = async (path: string, metadata: IProjectMeta | null) => {
    await readConfigFromModpack(path);
    navigate('project');
    ipcRenderer.send('on-open-project');
    if (metadata) {
      setProject(metadata);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-5 overflow-y-auto">
      <AddProject />
      {projects.map((p) => (
        <ProjectCard title={p.name} path={p.path} key={p.name} onOpen={open} />
      ))}
    </div>
  );
}
