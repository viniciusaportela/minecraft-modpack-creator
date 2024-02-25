import { Handle, Position } from 'reactflow';
import { memo } from 'react';

export default memo(({ data }: { data: any }) => {
  console.log('TreeNode');

  return (
    <div className="rounded-full w-5 h-5 border-1 border-solid flex items-center justify-center">
      <Handle type="source" position={Position.Bottom} id="main" />
      <Handle type="target" position={Position.Bottom} id="main" />
    </div>
  );
});
