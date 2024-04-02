import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import FileNode from './FileNode';

interface FilesTreeProps {
  nodes: ConfigNode[];
  onNodeClick?: (node: ConfigNode) => void;
}

export default function FilesTree({ nodes, onNodeClick }: FilesTreeProps) {
  return (
    <div className="w-[260px] overflow-x-auto rounded-md bg-zinc-800 p-3 h-full">
      {nodes.map((n) => (
        <FileNode
          node={n}
          key={n.getPath()}
          nestLevel={0}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  );
}
