import { Folder, GearSix, Warning } from '@phosphor-icons/react';
import path from 'path';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';

export interface FileNodeProps {
  isSelected?: (node: ConfigNode) => boolean;
  node: ConfigNode;
  nestLevel: number;
  onNodeClick?: (node: ConfigNode) => void;
  invalidNodes?: { node: ConfigNode; severity?: string }[];
}

export default function FileNode({
  node,
  nestLevel,
  onNodeClick,
  isSelected,
  invalidNodes,
}: FileNodeProps) {
  const nodePath = node.getPath();
  const name = path.basename(nodePath);
  const isDirectory = node.isDirectory();

  const isInvalid = invalidNodes?.find(
    (invalid) => invalid.node.getPath() === node.getPath(),
  );

  return (
    <div
      className="flex flex-col min-w-fit"
      style={{ marginLeft: nestLevel > 0 ? 30 : 0 }}
    >
      {isDirectory ? (
        <>
          <div className={clsx('flex gap-2 items-center min-w-fit my-1.5')}>
            <Folder
              weight="fill"
              size={24}
              className="min-h-[24px] min-w-[24px] text-zinc-700"
            />
            <span className="text-sm font-bold min-w-fit -mb-1.5">{name}</span>
          </div>
          {node.getChildren().map((n) => (
            <FileNode
              node={n}
              isSelected={isSelected}
              invalidNodes={invalidNodes}
              key={n.getPath()}
              nestLevel={nestLevel + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </>
      ) : (
        <Button
          variant="light"
          onPress={() => onNodeClick?.(node)}
          className={clsx(
            isSelected?.(node) ? 'bg-zinc-700' : 'bg-zinc-800',
            'justify-start -ml-4',
            isInvalid &&
              `border-1 ${
                isInvalid.severity === 'error'
                  ? 'border-danger-300'
                  : 'border-warning-300'
              }`,
          )}
          startContent={
            isInvalid ? (
              <Warning
                size={18}
                weight="bold"
                className={
                  isInvalid.severity === 'error'
                    ? 'text-danger-300'
                    : 'text-warning-300'
                }
              />
            ) : (
              <GearSix
                weight="fill"
                size={18}
                className="min-h-[20px] min-w-[20px]"
              />
            )
          }
        >
          <span className="-mb-0.5">{name}</span>
        </Button>
      )}
    </div>
  );
}
