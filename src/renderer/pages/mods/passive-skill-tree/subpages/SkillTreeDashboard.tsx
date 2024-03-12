import { Button } from '@nextui-org/react';
import { usePager } from '../../../../components/pager/hooks/usePager';

export default function SkillTreeDashboard() {
  const { navigate } = usePager();

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Tree Configuration</h1>
      <Button className="w-72 mt-1" onPress={() => navigate('edit-tree')}>
        Edit tree
      </Button>
    </div>
  );
}
