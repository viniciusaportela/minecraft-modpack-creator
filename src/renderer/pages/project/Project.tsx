import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  ScrollShadow,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import { Folder, Hammer, X } from '@phosphor-icons/react';
import { ipcRenderer } from 'electron';
import toast from 'react-hot-toast';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import useHorizontalScroll from '../../hooks/use-horizontal-scroll.hook';
import Recipes from '../recipes/Recipes';
import { pageByMod } from '../../constants/page-by-mod';
import DefaultPlugin from '../mods/default/DefaultPlugin';
import { usePager } from '../../components/pager/hooks/usePager';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import ModpackBuilder from '../../core/builder/ModpackBuilder';
import BuildingModal from './components/BuildingModal';
import { ModConfigProvider } from '../../store/providers/mod-config-provider';
import Configs from '../configs/Configs';
import PageHider from './components/PageHider';
import BuildErrorReport from '../../components/build-error-modal/BuildErrorReport';
import SearchBar from '../../components/search-bar/SearchBar';
import { useModsStore } from '../../store/mods.store';
import { IMod } from '../../store/interfaces/mods-store.interface';
import ProjectService from '../../core/domains/project/project-service';
import { useSelectedProject } from '../../store/app.store';
import {
  useProjectSelector,
  useProjectStore,
} from '../../store/hooks/use-project-store';
import openFolder from '../../helpers/open-folder';
import { ModCard } from './components/ModCard';

export default function Project() {
  useHorizontalScroll('tabs');

  const { navigate } = usePager();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [buildingProgressText, setBuildingProgressText] =
    useState('Building mods...');
  const [buildingTotalProgress, setBuildingTotalProgress] = useState(1);

  const project = useSelectedProject();
  const mods = useModsStore((st) => Object.values(st.mods));

  const projectStore = useProjectStore();
  const openedTabs = useProjectSelector((st) => st.openedTabs);
  const focusedTab = useProjectSelector((st) => st.focusedTab);

  const [modsFilter, setModsFilter] = useState('');

  const {
    isOpen: isReportOpen,
    onOpenChange: onReportOpenChange,
    onOpen: onOpenReport,
  } = useDisclosure();
  const [buildReportError, setBuildReportError] = useState<Error | null>(null);

  useLayoutEffect(() => {
    ipcRenderer.send('resize', 1280, 900);
  }, []);

  async function build() {
    setIsBuilding(true);
    try {
      onOpen();
      await new ModpackBuilder()
        .onProgress((progress, progressText, totalProgress) => {
          setBuildingProgress(progress);
          setBuildingProgressText(progressText);
          setBuildingTotalProgress(totalProgress);
        })
        .build(project!);

      toast.success('Build successful!');
    } catch (error) {
      console.error(error);
      toast.error('Build Failed');
      openBuildErrorReport(error as Error);
    } finally {
      onClose();
      setIsBuilding(false);
    }
  }

  function openBuildErrorReport(error: Error) {
    setBuildReportError(error);
    onOpenReport();
  }

  function clickOnMod(addon: IMod) {
    const exists = openedTabs.find((tab) => tab.name === addon.name);

    if (!exists) {
      projectStore.setState((st) => {
        st.openedTabs.push(addon);
      });
    }

    setTimeout(() => {
      projectStore.setState({ focusedTab: addon.name });
    }, 0);
  }

  function closeTab(tab: string) {
    const newTabs = openedTabs.filter((addon) => addon.name !== tab);

    if (tab === focusedTab) {
      const selectedTabIndex = openedTabs.findIndex(
        (opened) => opened.name === tab,
      );
      const beforeSelectedTab = openedTabs[selectedTabIndex - 1];

      projectStore.setState({
        focusedTab: beforeSelectedTab?.name ?? 'recipes',
      });
    }

    projectStore.setState({ openedTabs: newTabs });
  }

  function getModFromTab(tab: string) {
    return mods.find((addon) => addon.name === tab);
  }

  function getModViewFromTab(tab: string) {
    const mod = getModFromTab(tab);
    const CustomPlugin = pageByMod[mod?.id as keyof typeof pageByMod];

    return (
      <ModConfigProvider mod={mod} key={mod?.id || tab}>
        <PageHider isVisible={isVisible(tab)}>
          {CustomPlugin ? (
            <CustomPlugin
              mod={getModFromTab(tab)}
              isVisible={isVisible(tab)}
              key={tab}
            />
          ) : (
            <DefaultPlugin
              mod={getModFromTab(tab)}
              isVisible={isVisible(tab)}
              key={tab}
            />
          )}
        </PageHider>
      </ModConfigProvider>
    );
  }

  function isVisible(current: string) {
    return current === focusedTab;
  }

  function openProjectFolder() {
    openFolder(project!.path);
  }

  const filteredMods = modsFilter
    ? mods.filter((mod) =>
        mod.name.toLowerCase().includes(modsFilter.toLowerCase()),
      )
    : mods;

  return (
    <div className="flex flex-1 min-h-0">
      <BuildingModal
        isOpen={isOpen}
        progress={buildingProgress}
        totalProgress={buildingTotalProgress}
        progressText={buildingProgressText}
        onOpenChange={onOpenChange}
      />
      <AppBarHeader
        title={project?.name ?? ''}
        goBack={() => {
          ProjectService.getInstance().unselectProject();
          navigate('projects');
        }}
      >
        <AppBarHeaderContainer>
          <div className="flex-1 app-bar-drag h-full" />
          <Button
            size="sm"
            className="mr-2"
            isIconOnly
            onPress={() => openProjectFolder()}
          >
            <Folder size={18} />
          </Button>
          <Button
            startContent={isBuilding ? undefined : <Hammer size={16} />}
            className="my-3"
            color="primary"
            size="sm"
            disabled={isBuilding}
            isLoading={isBuilding}
            onPress={() => build()}
          >
            Build
          </Button>
        </AppBarHeaderContainer>
      </AppBarHeader>
      <div className="w-80 border-[0.5px] border-solid border-zinc-800 border-t-0 flex flex-col">
        <span className="text-lg p-5 pb-3">{mods.length} mods</span>

        <SearchBar
          text={modsFilter}
          onChange={setModsFilter}
          className="px-5 mb-2 pr-8"
        />

        <div className="flex-1 min-h-0">
          <AutoSizer>
            {({ height, width }) => (
              <List
                itemCount={filteredMods.length}
                height={height}
                width={width}
                className="pb-3"
                itemSize={80}
              >
                {({ style, index }) => (
                  <div className="px-5" style={style}>
                    <ModCard
                      onClickMod={(m) => clickOnMod(m)}
                      mod={filteredMods[index]}
                    />
                  </div>
                )}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollShadow
          className="p-5 w-full no-scrollbar min-h-[80px]"
          orientation="horizontal"
          id="tabs"
        >
          <Tabs
            selectedKey={focusedTab}
            onSelectionChange={(tab) =>
              projectStore.setState({ focusedTab: tab.toString() })
            }
          >
            <Tab key="recipes" title="Recipes" />
            <Tab key="items" title="Items" />
            <Tab key="blocks" title="Blocks" />
            <Tab key="configs" title="Configs" />
            <Tab key="progression" title="Progression" />
            {openedTabs.map((addon) => (
              <Tab
                key={addon.name}
                title={
                  <div className="flex items-center">
                    <span>{addon.name}</span>
                    <Button
                      className="min-w-5 w-5 min-h-5 h-5 p-0"
                      variant="light"
                      onPress={() => closeTab(addon.name)}
                    >
                      <X size={16} className="text-zinc-400" />
                    </Button>
                  </div>
                }
              />
            ))}
          </Tabs>
        </ScrollShadow>
        <PageHider isVisible={isVisible('recipes')}>
          <Recipes />
        </PageHider>
        <PageHider isVisible={isVisible('configs')}>
          <Configs />
        </PageHider>
        {openedTabs.map((addon) => getModViewFromTab(addon.name))}
      </div>
      <BuildErrorReport
        isOpen={isReportOpen}
        onOpenChange={onReportOpenChange}
        error={buildReportError}
      />
    </div>
  );
}
