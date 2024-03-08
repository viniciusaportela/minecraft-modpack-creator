import { useReactFlow } from 'reactflow';

interface PositionGetterProps {
  fnRef: React.MutableRefObject<any>;
}

export default function ScreenToFlowPositionGetter({
  fnRef,
}: PositionGetterProps) {
  const reactFlow = useReactFlow();

  if (fnRef) {
    fnRef.current = reactFlow.screenToFlowPosition;
  }

  return null;
}
