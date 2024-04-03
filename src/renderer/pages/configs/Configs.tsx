import { useEffect, useRef, useState } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { PencilSimple, PenNib } from '@phosphor-icons/react';
import { Resizable } from 're-resizable';
import { useAppStore } from '../../store/app.store';
import FilesTree from '../../components/files-tree/FilesTree';
import RawConfigEditor from './components/RawConfigEditor';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import RefinedConfigEditor from './components/RefinedConfigEditor';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import filesTree from '../../components/files-tree/FilesTree';
import SearchBar from '../../components/search-bar/SearchBar';

export default function Configs() {
  const configNodes = useAppStore((st) => st.configs);
  const filesTreeRef = useRef<HTMLDivElement>();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const [treeWidth, setTreeWidth] = useState(260);
  const [editorType, setEditorType] = useState('refined');
  const [contentSize, setContentSize] = useState(400);
  const [searchTxt, setSearchTxt] = useState('');

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

  useEffect(() => {
    if (filesTreeRef.current) {
      setContentSize(filesTreeRef.current!.scrollWidth + 16);
    }
  }, []);

  const [selectedConfig, setSelectedConfig] = useState(
    getFirstFile(configNodes!),
  );

  return (
    <div className="flex h-full">
      <Resizable
        size={{ height: 'auto', width: treeWidth }}
        onResize={(e, direction, ref, d) => {
          setTreeWidth((prev) => ref.clientWidth);
        }}
        minWidth={200}
        maxWidth={contentSize}
        enable={{ right: true }}
      >
        <FilesTree
          nodes={configNodes!}
          onNodeClick={(node) => setSelectedConfig(node)}
          ref={filesTreeRef}
          width={treeWidth}
          filterText={searchTxt}
        />
      </Resizable>

      <div className="flex flex-1 flex-col pl-4 h-full">
        {selectedConfig && (
          <>
            <SearchBar
              text={searchTxt}
              onChange={setSearchTxt}
              className="mb-2"
              classNames={{ inputWrapper: 'h-10' }}
            />
            <div className="flex items-center justify-between mb-2 min-h-[40px]">
              <span className="text-lg font-bold mb-1">
                {selectedConfig.getPath().replace(`${project?.path}/`, '')}
              </span>
              {selectedConfig.getFileType() === 'toml' && (
                <Tabs onSelectionChange={(key) => setEditorType(key as string)}>
                  <Tab title={<PenNib />} key="refined" />
                  <Tab title={<PencilSimple />} key="raw" />
                </Tabs>
              )}
            </div>
            {editorType === 'refined' &&
            selectedConfig.getFileType() === 'toml' ? (
              <RefinedConfigEditor config={selectedConfig} />
            ) : (
              <RawConfigEditor config={selectedConfig} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
