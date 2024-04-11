import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Tab, Tabs, Tooltip } from '@nextui-org/react';
import {
  File,
  Octagon,
  PencilSimple,
  PenNib,
  Rewind,
} from '@phosphor-icons/react';
import { Resizable } from 're-resizable';
import clsx from 'clsx';
import path from 'path';
import { cp } from 'node:fs/promises';
import { useAppStore } from '../../store/app.store';
import FilesTree from '../../components/files-tree/FilesTree';
import RawConfigEditor from './components/RawConfigEditor/RawConfigEditor';
import { useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ProjectModel } from '../../core/models/project.model';
import RefinedConfigEditor from './components/RefinedConfigEditor/RefinedConfigEditor';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import SearchBar from '../../components/search-bar/SearchBar';
import Alert from '../../components/alert/Alert';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { RefinedConfigProvider } from '../../core/domains/minecraft/config/RefinedConfigContext';
import { RefinedField } from '../../core/domains/minecraft/config/interfaces/parser';

const getFirstFile = (nodes: ConfigNode[]) => {
  const toRead = [...nodes];
  while (toRead.length) {
    const node = toRead.shift();
    if (node) {
      if (node.isDirectory()) {
        toRead.push(...node.getChildren());
      } else {
        return node;
      }
    }
  }
};

export default function Configs() {
  const configNodes = useAppStore((st) => st.configs)!;
  const flattedNodes = useMemo(
    () => configNodes.flatMap((node) => node.cloneFlat()),
    [],
  );
  const filesTreeRef = useRef<HTMLDivElement>();
  const handleError = useErrorHandler();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!);

  const [treeWidth, setTreeWidth] = useState(260);
  const [editorType, setEditorType] = useState('refined');
  const [contentSize, setContentSize] = useState(400);
  const [searchTxt, setSearchTxt] = useState('');
  const [isResetingFile, setIsResetingFile] = useState(false);

  const [invalidNodes, setInvalidNodes] = useState<ConfigNode[]>([]);
  const [fields, setFields] = useState<RefinedField[]>([]);
  const [selectedConfig, setSelectedConfig] = useState(
    getFirstFile(configNodes!),
  );

  useEffect(() => {
    const interval = window.setInterval(async () => {
      if (configNodes) {
        const results = await Promise.all(
          flattedNodes.map(async (node) => ({
            isValid: await node.isValid(),
            node,
          })),
        );

        const invalids = results.filter((v) => !v.isValid);
        console.log(invalids);
        setInvalidNodes(invalids.map((inv) => inv.node));
      }
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setFields(selectedConfig?.getData() ?? []);
  }, [selectedConfig]);
  console.log('fields', fields);

  useEffect(() => {
    if (filesTreeRef.current) {
      setContentSize(filesTreeRef.current!.scrollWidth + 16);
    }
  }, []);

  const isSelectedInvalid = invalidNodes?.find(
    (n) => n.getPath() === selectedConfig?.getPath(),
  );

  const resetFromSourceSelected = async () => {
    setIsResetingFile(true);
    try {
      if (selectedConfig) {
        const virtualPath = selectedConfig.getPath();
        const relativePath = virtualPath.replace(
          `${project?.path}/minecraft_toolkit/configs/`,
          '',
        );
        const finalPath = path.join(project!.path, relativePath);
        await cp(finalPath, virtualPath);
        await selectedConfig.setupFile();
        setFields(selectedConfig.getData() ?? []);
      }
    } catch (err) {
      await handleError(err);
    } finally {
      setIsResetingFile(false);
    }
  };

  return (
    <div className="flex h-full">
      <Resizable
        size={{ height: 'auto', width: treeWidth }}
        onResize={(e, direction, ref) => {
          setTreeWidth(() => ref.clientWidth);
        }}
        minWidth={200}
        maxWidth={contentSize}
        enable={{ right: true }}
      >
        <FilesTree
          nodes={configNodes!}
          onNodeClick={(node) => setSelectedConfig(node)}
          ref={filesTreeRef}
          selectedNode={selectedConfig}
          invalidNodes={invalidNodes}
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
            <div className="flex items-center min-h-[40px] mb-2">
              <span className="text-lg font-bold mb-1">
                {selectedConfig
                  .getPath()
                  .replace(`${project?.path}/minecraft_toolkit/configs/`, '')}
              </span>
              <Tooltip content="Reload from disk">
                <Button
                  isLoading={isResetingFile}
                  onPress={resetFromSourceSelected}
                  isIconOnly
                  className={clsx(
                    'ml-auto',
                    selectedConfig.getFileType() === 'toml' && 'mr-1',
                  )}
                >
                  <div>
                    <File size={18} />
                    <Octagon
                      className="absolute text-zinc-700 bottom-[1px] right-[2px]"
                      size={18}
                      weight="fill"
                    />
                    <Rewind
                      className="absolute bottom-[5px] right-[4px]"
                      size={14}
                    />
                  </div>
                </Button>
              </Tooltip>
              {selectedConfig.getFileType() === 'toml' && (
                <Tabs onSelectionChange={(key) => setEditorType(key as string)}>
                  <Tab title={<PenNib />} key="refined" />
                  <Tab title={<PencilSimple />} key="raw" />
                </Tabs>
              )}
            </div>
            {isSelectedInvalid && (
              <Alert
                text="The parser can't read this file. This will block the build process. Try finding what is making this file invalid"
                className="mb-3 -mt-1"
              />
            )}
            <RefinedConfigProvider fields={fields} root={selectedConfig}>
              {editorType === 'refined' &&
              selectedConfig.getFileType() === 'toml' ? (
                <RefinedConfigEditor />
              ) : (
                <RawConfigEditor config={selectedConfig} />
              )}
            </RefinedConfigProvider>
          </>
        )}
      </div>
    </div>
  );
}
