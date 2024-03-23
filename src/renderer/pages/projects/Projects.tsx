import React, { useEffect, useRef, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, Divider, Input, useDisclosure } from '@nextui-org/react';
import { ArrowClockwise, MagnifyingGlass } from '@phosphor-icons/react';
import { Types } from 'realm';
import ProjectCard from './components/ProjectCard';
import AddProject from './components/AddProject';
import { usePager } from '../../components/pager/hooks/usePager';
import { useQuery, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import { GlobalStateModel } from '../../core/models/global-state.model';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import LoadProjectModal from './components/LoadProjectModal';
import { useAppStore } from '../../store/app.store';
import ProjectService from '../../core/domains/project/project-service';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { useModConfigStore } from '../../store/mod-config.store';
import { MinecraftVersionPickerModal } from './components/MinecraftVersionPickerModal';

export default function Projects() {
  const handleError = useErrorHandler();

  const realm = useAppStore((st) => st.realm)!;
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);

  const projectService = useRef(new ProjectService()).current;

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

  const projects = useQuery(ProjectModel);

  const [filterText, setFilterText] = useState('');

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
      await handleError(err);
    }
  };

  const validateMinecraftProject = (project: ProjectModel) => {
    if (project.minecraftVersion === 'unknown') {
      onMinecraftVersionPickerOpen();
      return false;
    }

    return true;
  };

  const open = async (projectId: Types.ObjectId) => {
    try {
      console.log('open', useModConfigStore.getState());
      useModConfigStore.setState(
        (st: any) => ({
          hooks: {},
          updateConfig: st.updateConfig,
          registerHook: st.registerHook,
          unregisterHook: st.unregisterHook,
        }),
        true,
      );
      realm.write(() => {
        globalState.selectedProjectId = projectId;
      });
      useAppStore.setState({
        selectedProjectId: projectId,
      });

      const project = projects.find(
        (p) => p._id.toString() === globalState.selectedProjectId!.toString(),
      )!;
      console.log('project', project);
      if (project.launcher === 'minecraft') {
        if (!validateMinecraftProject(project)) {
          return;
        }
      }

      navigate('project-preload');
    } catch (e) {
      await handleError(e);
    }
  };

  const filteredProjects = filterText
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()),
      )
    : projects;

  const onPickMinecraftVersion = (chosenVersion: string) => {
    console.log('picked', chosenVersion);
    realm.write(() => {
      const project = projects.find(
        (p) => p._id.toString() === globalState.selectedProjectId!.toString(),
      )!;
      project.minecraftVersion = chosenVersion;
    });
    onMinecraftVersionPickerClose();
    navigate('project-preload');
  };

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
        {filteredProjects.map((p) => (
          <ProjectCard
            title={p.name}
            projectId={p._id}
            key={p.name}
            launcher={p.launcher}
            onOpen={open}
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
      />
    </>
  );
}
