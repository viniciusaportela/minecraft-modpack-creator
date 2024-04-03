import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { TextureModel } from '../../core/models/texture.model';
import { ModModel } from '../../core/models/mod.model';
import { ItemModel } from '../../core/models/item.model';
import SearchBar from '../../components/search-bar/SearchBar';

export default function Projects() {
  const handleError = useErrorHandler();

  const realm = useAppStore((st) => st.realm)!;
  const { navigate } = usePager();
  const globalState = useQueryFirst(GlobalStateModel);
  const [initialVersion, setInitialVersion] = useState('');

  const projectService = useRef(new ProjectService()).current;

  const versionPickerParams = useRef<{
    projectId: Types.ObjectId;
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

  const projects = useQuery(ProjectModel);

  const [filterText, setFilterText] = useState('');

  useLayoutEffect(() => {
    console.log(globalState.selectedProjectId);
    if (globalState.selectedProjectId) {
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
      await handleError(err);
    }
  };

  const validateMinecraftProject = (project: ProjectModel) => {
    if (project.minecraftVersion === 'unknown') {
      versionPickerParams.current = {
        projectId: project._id,
        redirect: true,
      };
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

      realm.write(() => {
        project.lastOpenAt = new Date();
      });
      navigate('project-preload');
    } catch (e) {
      await handleError(e);
    }
  };

  const onPickMinecraftVersion = async (chosenVersion: string) => {
    try {
      const project = projects.find(
        (p) =>
          p._id.toString() ===
          versionPickerParams.current?.projectId.toString(),
      )!;

      console.log('picked', chosenVersion);
      realm.write(() => {
        project.minecraftVersion = chosenVersion;
        project.loaded = false;

        const minecraftMod = realm
          .objects<ModModel>(ModModel.schema.name)
          .filtered('modId = $0 AND project = $1', 'minecraft', project._id)[0];

        if (minecraftMod) {
          minecraftMod.loadedTextures = false;
          minecraftMod.loadedItems = false;
          minecraftMod.loadedBlocks = false;

          const textures = realm
            .objects(TextureModel.schema.name)
            .filtered('mod = $0', minecraftMod._id);
          realm.delete(textures);

          const items = realm
            .objects(ItemModel.schema.name)
            .filtered('mod = $0', minecraftMod._id);
          realm.delete(items);

          const blocks = realm
            .objects(ItemModel.schema.name)
            .filtered('mod = $0', minecraftMod._id);
          realm.delete(blocks);
        }
      });

      onMinecraftVersionPickerClose();

      if (versionPickerParams.current?.redirect) {
        realm.write(() => {
          project.lastOpenAt = new Date();
        });
        navigate('project-preload');
      }
    } catch (e) {
      await handleError(e);
    }
  };

  const deleteProject = async (projectId: Types.ObjectId) => {
    projectService.deleteProject(projectId).catch(handleError);
  };

  const onOpenVersionPicker = (projectId: Types.ObjectId, version: string) => {
    versionPickerParams.current = {
      projectId,
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
      return b.lastOpenAt.getTime() - a.lastOpenAt.getTime();
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
            projectId={p._id}
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
