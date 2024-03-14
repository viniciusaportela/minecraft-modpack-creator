import { useReactFlow } from 'reactflow';
import React, { memo } from 'react';

interface PositionGetterProps {
  fnRef: React.MutableRefObject<any>;
}

const FitViewGetter = memo(({ fnRef }: PositionGetterProps) => {
  const reactFlow = useReactFlow();

  if (fnRef) {
    fnRef.current = reactFlow.fitView;
  }

  return null;
});

export default FitViewGetter;
