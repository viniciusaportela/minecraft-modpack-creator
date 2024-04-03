import { useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { PencilSimple, PenNib } from '@phosphor-icons/react';
import { useAppStore } from '../../store/app.store';
import FilesTree from '../../components/FilesTree/FilesTree';
import RawConfigEditor from './components/RawConfigEditor';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import RefinedConfigEditor from './components/RefinedConfigEditor';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';

export default function Configs() {
  const configNodes = useAppStore((st) => st.configs);
  console.log('configNodes', configNodes);

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const getFirstFile = (nodes: ConfigNode[]) => {
    const toRead = [...nodes];
    while (toRead.length) {
      const node = toRead.pop();
      if (node) {
        if (node.isDirectory()) {
          toRead.push(...node.getChildren());
        } else {
          return node;
        }
      }
    }
  };

  const [selectedConfig, setSelectedConfig] = useState(
    getFirstFile(configNodes!),
  );

  return (
    <div className="flex h-full">
      <FilesTree
        nodes={configNodes!}
        onNodeClick={(node) => setSelectedConfig(node)}
      />
      <div className="flex flex-1 flex-col pl-4 h-full">
        <div className="flex items-center justify-between mb-2 min-h-[40px]">
          <span className="text-lg font-bold mb-1">
            {selectedConfig?.getPath().replace(`${project?.path}/`, '')}
          </span>
          {selectedConfig && selectedConfig.getFileType() === 'toml' && (
            <Tabs>
              <Tab title={<PenNib />} key="refined" />
              <Tab title={<PencilSimple />} key="raw" />
            </Tabs>
          )}
        </div>
        {selectedConfig && <RawConfigEditor config={selectedConfig} />}
      </div>
    </div>
  );
}
