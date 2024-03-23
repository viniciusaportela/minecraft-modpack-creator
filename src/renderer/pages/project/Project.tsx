import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Image,
  ScrollShadow,
  Tab,
  Tabs,
  useDisclosure,
} from '@nextui-org/react';
import { Hammer, X } from '@phosphor-icons/react';
import { ipcRenderer } from 'electron';
import toast from 'react-hot-toast';
import useHorizontalScroll from '../../hooks/use-horizontal-scroll.hook';
import Recipes from '../recipes/Recipes';
import { pageByMod } from '../../constants/page-by-mod';
import DefaultPlugin from '../mods/default/DefaultPlugin';
import { usePager } from '../../components/pager/hooks/usePager';
import AppBarHeader, {
  AppBarHeaderContainer,
} from '../../components/app-bar/AppBarHeader';
import { useQuery, useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import ModId from '../../typings/mod-id.enum';
import { ModModel } from '../../core/models/mod.model';
import ModpackBuilder from '../../core/builder/ModpackBuilder';
import BuildingModal from './components/BuildingModal';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { ModConfigProvider } from '../../store/mod-config-provider';
import NoThumb from '../../assets/no-thumb.png';

export default function Project() {
  useHorizontalScroll('tabs');

  const { navigate } = usePager();

  const handleError = useErrorHandler();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [buildingProgressText, setBuildingProgressText] =
    useState('Building mods...');
  const [buildingTotalProgress, setBuildingTotalProgress] = useState(1);

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;
  const mods = useQuery(ModModel, (obj) =>
    obj.filtered('modId != $0 AND project = $1', ModId.Minecraft, project._id),
  );

  useLayoutEffect(() => {
    ipcRenderer.send('resize', 1280, 900);
  }, []);

  const [openedModTabs, setOpenedModTabs] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('recipes');

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
        .build(project);

      toast.success('Build successful!');
    } catch (e) {
      console.error(e);
      await handleError(e);
    } finally {
      onClose();
      setIsBuilding(false);
    }
  }

  function clickOnMod(addon: ModModel) {
    const exists = openedModTabs.find((tab) => tab.name === addon.name);

    if (!exists) {
      setOpenedModTabs([...openedModTabs, addon]);
    }

    setTimeout(() => {
      setSelectedTab(addon.name);
    }, 0);
  }

  function closeTab(tab: string) {
    const newTabs = openedModTabs.filter((addon) => addon.name !== tab);

    if (tab === selectedTab) {
      const selectedTabIndex = openedModTabs.findIndex(
        (opened) => opened.name === tab,
      );
      const beforeSelectedTab = openedModTabs[selectedTabIndex - 1];
      setSelectedTab(beforeSelectedTab?.name ?? 'recipes');
    }

    setOpenedModTabs(newTabs);
  }

  function getModFromTab(tab: string) {
    return mods.find((addon) => addon.name === tab)!;
  }

  function getModViewFromTab(tab: string) {
    const mod = getModFromTab(tab);
    const Plugin = pageByMod[mod.modId as keyof typeof pageByMod];

    return (
      <ModConfigProvider mod={mod} key={mod.modId}>
        {Plugin ? (
          <Plugin
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
      </ModConfigProvider>
    );
  }

  function isVisible(current: string) {
    return current === selectedTab;
  }

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
        goBack={() => navigate('projects')}
      >
        <AppBarHeaderContainer>
          <div className="flex-1 app-bar-drag h-full" />
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

        <div className="flex-1 min-h-0">
          <ScrollShadow className="flex flex-col gap-2 h-full max-h-full pb-5 px-5">
            {mods.map((mod) => (
              <div>
                <Card
                  className="w-full"
                  isPressable
                  key={mod.name}
                  isHoverable
                  onPress={() => clickOnMod(mod)}
                >
                  <CardBody className="min-h-fit flex flex-row">
                    <Image
                      src={mod.thumbnail ?? NoThumb}
                      className="w-full h-full"
                      classNames={{
                        wrapper: 'min-w-10 min-h-10 w-10 h-10 mr-3',
                      }}
                    />
                    <span className="font-bold text-left flex-1">
                      {mod.name}
                    </span>
                  </CardBody>
                </Card>
              </div>
            ))}
          </ScrollShadow>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollShadow
          className="p-5 w-full no-scrollbar"
          orientation="horizontal"
          id="tabs"
        >
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(tab) => setSelectedTab(tab.toString())}
          >
            <Tab key="recipes" title="Recipes" />
            <Tab key="items" title="Items" />
            <Tab key="blocks" title="Blocks" />
            <Tab key="progression" title="Progression" />
            {openedModTabs.map((addon) => (
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
        <Recipes isVisible={isVisible('recipes')} />
        {openedModTabs.map((addon) => getModViewFromTab(addon.name))}
      </div>
    </div>
  );
}
