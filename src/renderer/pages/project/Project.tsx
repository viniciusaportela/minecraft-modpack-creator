import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Image,
  ScrollShadow,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { useProject } from '../../context/project.context';
import { IProjectMeta } from '../../typings/project-meta.interface';

export default function Project() {
  const { project } = useProject();
  const [openedModsTabs, setOpenedModsTabs] = useState<any[]>([]);

  function clickOnMod(addon: IProjectMeta['installedAddons']) {
    setOpenedModsTabs([...openedModsTabs, addon]);
  }

  return (
    <div className="flex flex-1 min-h-0">
      <div className="w-80 border-[0.5px] border-solid border-zinc-800 border-t-0 flex flex-col">
        <span className="text-xl font-bold p-5">
          {project?.installedAddons.length} mods
        </span>

        <div className="[&_button]:min-h-fit [&_button]:overflow-visible h-full">
          <ScrollShadow className="flex flex-col gap-2 h-full pb-24 px-5">
            {project?.installedAddons.map((addon) => (
              <Card
                className="w-full"
                isPressable
                key={addon.name}
                isHoverable
                onPress={() => clickOnMod(addon)}
              >
                <CardHeader>
                  <Image
                    src={addon.thumbnailUrl}
                    className="min-w-10 min-h-10 w-10 h-10 mr-3"
                  />
                  <span className="font-bold text-left">{addon.name}</span>
                </CardHeader>
              </Card>
            ))}
          </ScrollShadow>
        </div>
      </div>

      <div className="p-5 flex-1">
        <Tabs>
          <Tab key="dependencies" title="Items Dependencies" />
          <Tab key="kubejs" title="KubeJS" />
          <Tab key="quests" title="Quests" />
          <Tab key="recipes" title="Recipes" />
          {openedModsTabs.map((addon) => (
            <Tab key={addon.name} title={addon.name} />
          ))}
        </Tabs>
      </div>
    </div>
  );
}
