import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, Divider, useDisclosure } from '@nextui-org/react';
import { ArrowClockwise } from '@phosphor-icons/react';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';
import { usePager } from '../../components/pager/hooks/usePager';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import LoadProjectModal from './components/LoadProjectModal';
import ProjectService from '../../core/domains/project/project-service';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { MinecraftVersionPickerModal } from './components/MinecraftVersionPickerModal';
import SearchBar from '../../components/search-bar/SearchBar';
import { IProject } from '../../store/interfaces/project.interface';
import { ModConfigStore } from '../../store/mod-config.store';
import { useAppStore } from '../../store/app.store';

export default function Projects() {
  const projects = useAppStore((st) => st.projects);
  const selectedProjectIndex = useAppStore((st) => st.selectedProjectIndex);

  console.log('projects', projects);

  const handleError = useErrorHandler();

  const { navigate } = usePager();
  const [initialVersion, setInitialVersion] = useState('');

  const projectService = ProjectService.getInstance();

  const versionPickerParams = useRef<{
    projectIndex: number;
    redirect: boolean;
  } | null>(null);

  const {
    isOpen: isModalOpen,
    onOpenChange: onModalOpenChange,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const {
    isOpen: isMinecraftVersionPickerOpen,
    onOpenChange: onMinecraftVersionPickerOpenChange,
    onOpen: onMinecraftVersionPickerOpen,
    onClose: onMinecraftVersionPickerClose,
  } = useDisclosure();

  const [filterText, setFilterText] = useState('');

  useLayoutEffect(() => {
    if (selectedProjectIndex !== -1) {
      navigate('project-preload');
    }
  }, []);

  useEffect(() => {
    projectService.populateProjects().catch(handleError);
    ipcRenderer.send('resize', 800, 600);
    ipcRenderer.send('make-no-resizable');

    return () => {
      ipcRenderer.send('make-resizable');
    };
  }, []);

  const onAddNewProject = async (modpackFolder: string) => {
    try {
      await projectService.createFromFolder(modpackFolder);
      onModalClose();
    } catch (err) {
      if (err instanceof Error) {
        await handleError(err);
      }
    }
  };

  const validateMinecraftProject = (project: IProject) => {
    if (project.minecraftVersion === 'unknown') {
      versionPickerParams.current = {
        projectIndex: project.index,
        redirect: true,
      };
      onMinecraftVersionPickerOpen();
      return false;
    }

    return true;
  };

  const open = async (projectIdx: number) => {
    try {
      ModConfigStore.getInstance().clear();

      console.log('update selectedProjectIndex', projectIdx);
      ProjectService.getInstance().selectProject(projectIdx);

      const project = projects[projectIdx];
      if (project.launcher === 'minecraft') {
        if (!validateMinecraftProject(project)) {
          return;
        }
      }

      useAppStore.setState((st) => {
        st.projects[projectIdx].lastOpenAt = new Date().getTime();
      });

      navigate('project-preload');
    } catch (e) {
      if (e instanceof Error) {
        await handleError(e);
      }
    }
  };

  const onPickMinecraftVersion = async (chosenVersion: string) => {
    try {
      const project = useAppStore
        .getState()
        .projects.find(
          (p) => p.index === versionPickerParams.current?.projectIndex,
        )!;

      project.isLoaded = false;

      onMinecraftVersionPickerClose();

      if (versionPickerParams.current?.redirect) {
        project.lastOpenAt = new Date().getTime();
        navigate('project-preload');
      }
    } catch (e) {
      if (e instanceof Error) {
        await handleError(e);
      }
    }
  };

  const deleteProject = async (projectIdx: number) => {
    projectService.deleteProject(projectIdx).catch(handleError);
  };

  const onOpenVersionPicker = (projectIdx: number, version: string) => {
    versionPickerParams.current = {
      projectIndex: projectIdx,
      redirect: false,
    };
    setInitialVersion(version);
    onMinecraftVersionPickerOpen();
  };

  const filteredProjects = filterText
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()),
      )
    : Array.from(projects);

  const orderedProjects = filteredProjects.sort((a, b) => {
    if (a.lastOpenAt && !b.lastOpenAt) {
      return -1;
    }

    if (!a.lastOpenAt && b.lastOpenAt) {
      return 1;
    }

    if (a.lastOpenAt && b.lastOpenAt) {
      return b.lastOpenAt - a.lastOpenAt;
    }

    return 0;
  });

  return (
    <>
      <AppBarHeader title="My Projects">
        <AppBarHeaderContainer>
          <div className="flex-1 app-bar-drag h-full" />
          <div className="flex justify-center items-center w-10/12 max-w-[300px] justify-self-center">
            <SearchBar text={filterText} onChange={setFilterText} />
          </div>
          <div className="flex-1 app-bar-drag h-full" />
          <Button
            isIconOnly
            onPress={() => projectService.populateProjects().catch(handleError)}
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
        {orderedProjects.map((p) => (
          <ProjectCard
            title={p.name}
            projectIdx={p.index}
            key={p.path}
            launcher={p.launcher}
            onOpen={open}
            onDelete={deleteProject}
            onOpenVersionPicker={onOpenVersionPicker}
          />
        ))}
      </div>

      <LoadProjectModal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        onPressLoad={onAddNewProject}
      />

      <MinecraftVersionPickerModal
        isOpen={isMinecraftVersionPickerOpen}
        onOpenChange={onMinecraftVersionPickerOpenChange}
        onPickVersion={onPickMinecraftVersion}
        initialVersion={initialVersion}
      />
    </>
  );
}
