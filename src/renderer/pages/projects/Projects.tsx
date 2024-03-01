import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, Divider, Input, useDisclosure } from '@nextui-org/react';
import { ArrowClockwise, MagnifyingGlass } from '@phosphor-icons/react';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQuery, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import { useRealm } from '../../store/realm.context';
import { GlobalStateModel } from '../../core/models/global-state.model';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import LoadProjectModal from './components/LoadProjectModal';
import { ProjectsService } from '../../App';
import getCurseForgeFolder from '../../core/minecraft/helpers/get-curse-forge-folder';

export default function Projects() {
  const realm = useRealm();
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);

  const {
    isOpen: isModalOpen,
    onOpenChange: onModalOpenChange,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const projects = useQuery(ProjectModel);

  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    findProjects().catch(console.error);
    ipcRenderer.send('resize', 800, 600);
    ipcRenderer.send('make-no-resizable');

    return () => {
      ipcRenderer.send('make-resizable');
    };
  }, []);

  const onAddNewProject = async (modpackFolder: string) => {
    try {
      await ProjectsService.createProjectFromFolder(modpackFolder);
      onModalClose();
    } catch (err) {
      console.error(err);
    }
  };

  const findProjects = async (force = false) => {
    if (!globalState.hasCheckedForProjects || force) {
      const curseFolder = getCurseForgeFolder();

      if (curseFolder) {
        try {
          const folders = await ipcRenderer.invoke('readDir', curseFolder);
          const promises = folders.map((f: string) =>
            ProjectsService.createProjectFromFolder(`${curseFolder}/${f}`),
          );
          await Promise.all(promises);
        } catch (err) {
          // TODO add generic alert to user
          console.error(err);
        }
      }

      realm.write(() => {
        globalState.hasCheckedForProjects = true;
      });

      // TODO can have many version, need to choose one
      // const minecraftFolder = getMinecraftFolder();
      //
      // if (minecraftFolder) {
      //   try {
      //     await ProjectsService.createProjectFromFolder(minecraftFolder);
      //   } catch (err) {
      //     // TODO add generic alert to user
      //     console.error(err);
      //   }
      // }
    }
  };

  const open = async (projectId: string) => {
    realm.write(() => {
      globalState.selectedProjectId = projectId;
    });

    navigate('project-preload');
  };

  const filteredProjects = filterText
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()),
      )
    : projects;

  return (
    <>
      <AppBarHeader title="My Projects">
        <AppBarHeaderContainer>
          <div className="flex-1 app-bar-drag h-full" />
          <div className="flex justify-center items-center w-10/12 max-w-[300px] justify-self-center">
            <Input
              size="sm"
              value={filterText}
              endContent={
                <MagnifyingGlass size={16} className="text-zinc-500" />
              }
              classNames={{
                inputWrapper: 'h-5',
              }}
              onValueChange={(txt) => setFilterText(txt)}
            />
          </div>
          <div className="flex-1 app-bar-drag h-full" />
          <Button
            isIconOnly
            onPress={() => findProjects(true)}
            size="sm"
            variant="flat"
            className="mr-2"
          >
            <ArrowClockwise size={16} className="text-zinc-200" />
          </Button>
          <Divider orientation="vertical" />
        </AppBarHeaderContainer>
      </AppBarHeader>
      <div className="flex flex-wrap gap-4 p-5 overflow-y-auto">
        <AddProject onPress={onModalOpen} />
        {filteredProjects.map((p) => (
          <ProjectCard
            title={p.name}
            projectId={p._id.toString()}
            key={p.name}
            isCurseForge={p.fromCurseForge}
            onOpen={open}
          />
        ))}
      </div>

      <LoadProjectModal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        onPressLoad={onAddNewProject}
      />
    </>
  );
}
