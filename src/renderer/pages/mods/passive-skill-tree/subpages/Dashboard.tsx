import { Button } from '@nextui-org/react';
import { usePager } from '../../../../components/pager/hooks/usePager';

export default function Dashboard() {
  const { navigate } = usePager();

  return (
    <>
      <h1 className="font-bold text-lg">Tree Configuration</h1>
      <Button className="mb-3 w-72 mt-1" onPress={() => navigate('edit-tree')}>
        Edit tree
      </Button>
    </>
  );
}
