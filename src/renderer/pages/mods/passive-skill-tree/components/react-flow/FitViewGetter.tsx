import { useReactFlow } from 'reactflow';
import React from 'react';

interface PositionGetterProps {
  fnRef: React.MutableRefObject<any>;
}

export default function FitViewGetter({ fnRef }: PositionGetterProps) {
  const reactFlow = useReactFlow();

  if (fnRef) {
    fnRef.current = reactFlow.fitView;
  }

  return null;
}
