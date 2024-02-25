import { useState } from 'react';
import { Button } from '@nextui-org/react';
import ConfigEditor from '../../config-editor/ConfigEditor';
import ModId from '../../../typings/mod-id.enum';
import EditTree from './components/EditTree';

export default function PassiveSkillTree() {
  const [page, setPage] = useState<'dashboard' | 'config-editor' | 'edit-tree'>(
    'dashboard',
  );

  return (
    <div className="p-5 pt-0 w-full h-full">
      {page === 'dashboard' && (
        <>
          <h1 className="font-bold text-lg">Tree Configuration</h1>
          <Button
            className="mb-3 w-72 mt-1"
            onPress={() => setPage('edit-tree')}
          >
            Edit tree
          </Button>
        </>
      )}

      {page === 'edit-tree' && <EditTree setPage={setPage} />}

      {['dashboard', 'config-editor'].includes(page) && (
        <ConfigEditor setPage={setPage} modId={ModId.PassiveSkillTree} />
      )}
    </div>
  );
}
