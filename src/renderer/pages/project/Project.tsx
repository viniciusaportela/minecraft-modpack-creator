import React, { useLayoutEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Image,
  ScrollShadow,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { Hammer, X } from '@phosphor-icons/react';
import { ipcRenderer } from 'electron';
import useHorizontalScroll from '../../hooks/useHorizontalScroll.hook';
import Recipes from '../recipes/Recipes';
import { IProjectStore } from '../../store/interfaces/project-store.interface';
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

export default function Project() {
  useHorizontalScroll('tabs');

  const { navigate } = usePager();

  // TODO add loading state on start
  const [isBuilding, setIsBuilding] = useState(false);

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

  const getMapping = (recipe: IProjectStore['recipes'][0]) => {
    let differentItems = 0;
    const charByIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const mapping = {};

    for (let row = 0; row < recipe.input.length; row++) {
      for (let col = 0; col < recipe.input[row].length; col++) {
        if (recipe.input[row][col] !== null) {
          const found = Object.values(mapping).find(
            (value) => value === recipe.input[row][col],
          );

          if (!found) {
            mapping[charByIndex[differentItems]] = recipe.input[row][col];
            differentItems += 1;
          }
        }
      }
    }

    return mapping;
  };

  const getGrid = (recipe: IProjectStore['recipes'][0]) => {
    const mapping = getMapping(recipe);

    const grid: string[][] = [];
    for (let row = 0; row < 3; row++) {
      let str = '';
      for (let col = 0; col < 3; col++) {
        const item = recipe.input[row][col];
        if (item === null) {
          str += ' ';
        } else {
          const [alias] = Object.entries(mapping).find(
            ([_, id]) => id === item,
          );

          str += alias;
        }
      }
      grid.push(str);
    }

    return grid;
  };

  async function build() {
    setIsBuilding(true);
    try {
      // console.log('Building project...');
      // console.log(recipes);
      //
      // // TODO delete old data
      // // TODO generated based on type
      //
      // let index = 0;
      // for await (const recipe of recipes) {
      //   await ipcRenderer.invoke(
      //     'writeFile',
      //     `${project.path}kubejs/server_scripts/create-recipe-${index}.js`,
      //     `ServerEvents.recipes(event => {
      //       event.shaped(
      //         Item.of('${recipe.output}', ${recipe.outputCount}),
      //         ${JSON.stringify(getGrid(recipe))},
      //         ${JSON.stringify(getMapping(recipe))}
      //       )
      //     })`,
      //   );
      //   index += 1;
      // }
    } finally {
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

  function getAddonFromTab(tab: string) {
    return mods.find((addon) => addon.name === tab)!;
  }

  function getModViewFromTab(tab: string) {
    const Plugin =
      pageByMod[getAddonFromTab(tab).modId as keyof typeof pageByMod];

    return Plugin ? (
      <Plugin mod={getAddonFromTab(tab)} isVisible={isVisible(tab)} key={tab} />
    ) : (
      <DefaultPlugin
        mod={getAddonFromTab(tab)}
        isVisible={isVisible(tab)}
        key={tab}
      />
    );
  }

  function isVisible(current: string) {
    return current === selectedTab;
  }

  return (
    <div className="flex flex-1 min-h-0">
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
        <span className="text-lg p-5 pb-3">{mods.length - 1} mods</span>

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
                      // TODO type config
                      src={mod.getConfig().thumbnail}
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

      <div className="flex-1 overflow-hidden">
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
