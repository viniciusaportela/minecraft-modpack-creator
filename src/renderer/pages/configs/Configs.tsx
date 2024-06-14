import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAppStore, useSelectedProject } from '../../store/app.store';
import FilesTree from '../../components/files-tree/FilesTree';
import RawConfigEditor from './components/RawConfigEditor/RawConfigEditor';
import RefinedConfigEditor from './components/RefinedConfigEditor/RefinedConfigEditor';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import SearchBar from '../../components/search-bar/SearchBar';
import Alert from '../../components/alert/Alert';
import { useErrorHandler } from '../../core/errors/hooks/useErrorHandler';
import { RefinedConfigProvider } from '../../core/domains/minecraft/config/RefinedConfigContext';
import { RefinedField } from '../../core/domains/minecraft/config/interfaces/parser';

const getFirstFile = (nodes: readonly ConfigNode[]) => {
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

  return undefined;
};

const Configs = memo(() => {
  const configs = useAppStore((st) => st.configs);

  const flattedNodes = useMemo(
    () => configs?.flatMap((node) => node.cloneFlat()) ?? [],
    [],
  );
  const filesTreeRef = useRef<HTMLDivElement>();
  const handleError = useErrorHandler();

  const project = useSelectedProject();

  const [treeWidth, setTreeWidth] = useState(260);
  const [editorType, setEditorType] = useState('refined');
  const [contentSize, setContentSize] = useState(400);
  const [searchTxt, setSearchTxt] = useState('');
  const [isResetingFile, setIsResetingFile] = useState(false);

  const [invalidNodes, setInvalidNodes] = useState<
    { node: ConfigNode; severity: string }[]
  >([]);
  const [fields, setFields] = useState<RefinedField[]>([]);
  const [selectedConfig, setSelectedConfig] = useState(getFirstFile(configs!));

  useEffect(() => {
    const promises = flattedNodes.map(async (node) => {
      const { isValid, severity } = await node.isValid();

      return {
        isValid,
        severity,
        node,
      };
    });

    Promise.all(promises).then(async (results) => {
      const invalids = results.filter((v) => !v.isValid);

      setInvalidNodes(
        invalids.map((inv) => ({
          node: inv.node,
          severity: inv.severity as string,
        })),
      );
    });
  }, []);

  useEffect(() => {
    setFields(selectedConfig?.getFields() ?? []);
  }, [selectedConfig]);

  useEffect(() => {
    if (filesTreeRef.current) {
      setContentSize(filesTreeRef.current!.scrollWidth + 16);
    }
  }, []);

  const isSelectedInvalid = invalidNodes?.find(
    (n) => n.node.getPath() === selectedConfig?.getPath(),
  );

  const revalidateSelected = async () => {
    const { isValid, severity } = await selectedConfig!.isValid();

    if (isValid) {
      setInvalidNodes((prev) =>
        prev.filter(
          (invalid) => invalid.node.getPath() !== selectedConfig?.getPath(),
        ),
      );
    } else {
      const alreadyExists = invalidNodes.find(
        (invalid) => invalid.node.getPath() === selectedConfig?.getPath(),
      );

      if (!alreadyExists) {
        setInvalidNodes((prev) => [
          ...prev,
          { node: selectedConfig!, severity: severity as string },
        ]);
      }
    }
  };

  const resetFromSourceSelected = async () => {
    setIsResetingFile(true);
    try {
      if (selectedConfig) {
        const virtualPath = selectedConfig.getPath();
        const relativePath = path.relative(project?.path ?? '', virtualPath);
        const finalPath = path.join(project!.path, relativePath);
        await cp(finalPath, virtualPath);
        await selectedConfig.setupFile();
        setFields(selectedConfig.getFields() ?? []);
      }
    } catch (err) {
      if (err instanceof Error) {
        await handleError(err);
      }
    } finally {
      setIsResetingFile(false);
    }
  };

  const onUpdatedRaw = useCallback(async () => {
    await selectedConfig!.setupFile();
    setFields(selectedConfig?.getFields() ?? []);
    await revalidateSelected();
  }, [selectedConfig]);

  const onUpdatedRefined = useCallback(async () => {
    await selectedConfig?.setupFile();
    await revalidateSelected();
  }, [selectedConfig]);

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
          nodes={configs!}
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
                {path.relative(
                  path.join(
                    project?.path ?? '',
                    'minecraft-toolkit',
                    'configs',
                  ),
                  selectedConfig.getPath(),
                )}
              </span>
              <Tooltip content="Reload from disk">
                <Button
                  isLoading={isResetingFile}
                  onPress={resetFromSourceSelected}
                  isIconOnly
                  className={clsx(
                    'ml-auto h-[36px] w-[36px]',
                    selectedConfig.hasRefineEditor() && 'mr-1',
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
              {selectedConfig.hasRefineEditor() && (
                <Tabs onSelectionChange={(key) => setEditorType(key as string)}>
                  <Tab title={<PenNib />} key="refined" />
                  <Tab title={<PencilSimple />} key="raw" />
                </Tabs>
              )}
            </div>
            {isSelectedInvalid?.severity === 'error' && (
              <Alert
                text="The parser can't read this file. This will block the build process. Try finding what is making this file invalid"
                className="mb-3 -mt-1"
              />
            )}
            <RefinedConfigProvider fields={fields} root={selectedConfig}>
              {editorType === 'refined' && selectedConfig.hasRefineEditor() ? (
                <RefinedConfigEditor
                  onUpdatedRefined={onUpdatedRefined}
                  filter={searchTxt}
                />
              ) : (
                <RawConfigEditor
                  config={selectedConfig}
                  onUpdatedRaw={onUpdatedRaw}
                  filter={searchTxt}
                />
              )}
            </RefinedConfigProvider>
          </>
        )}
      </div>
    </div>
  );
});

export default Configs;
