import { forwardRef } from 'react';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import FileNode from './FileNode';

interface FilesTreeProps {
  nodes: ConfigNode[];
  onNodeClick?: (node: ConfigNode) => void;
  width?: number;
  filterText?: string;
  invalidNodes?: { node: ConfigNode; severity?: string }[];
  selectedNode?: ConfigNode;
}

const FilesTree = forwardRef<HTMLDivElement, FilesTreeProps>(
  (
    { nodes, onNodeClick, width, filterText, invalidNodes, selectedNode },
    ref,
  ) => {
    const filterNodes = () => {
      return nodes.map((n) => n.cloneWithFilter(filterText!)!);
    };

    const filteredNodes = filterText ? filterNodes() : nodes;

    return (
      <div
        className="overflow-x-auto rounded-md bg-zinc-800 p-3 h-full w-fit"
        ref={ref}
        style={{
          width,
        }}
      >
        {filteredNodes.map((n) => (
          <FileNode
            node={n}
            key={n.getPath()}
            invalidNodes={invalidNodes}
            isSelected={(n) => n === selectedNode}
            nestLevel={0}
            onNodeClick={onNodeClick}
          />
        ))}
      </div>
    );
  },
);

export default FilesTree;
