import { useReactFlow } from 'reactflow';
import React, { memo } from 'react';

interface PositionGetterProps {
  fnRef: React.MutableRefObject<any>;
}

const ScreenToFlowPositionGetter = memo(({ fnRef }: PositionGetterProps) => {
  const reactFlow = useReactFlow();

  if (fnRef) {
    fnRef.current = reactFlow.screenToFlowPosition;
  }

  return null;
});

export default ScreenToFlowPositionGetter;
