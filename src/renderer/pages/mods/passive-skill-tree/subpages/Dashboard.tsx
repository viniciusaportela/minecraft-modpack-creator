import { Button, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { usePager } from '../../../../components/pager/hooks/usePager';
import { useQuery, useQueryFirst } from '../../../../hooks/realm.hook';
import { ModModel } from '../../../../core/models/mod.model';
import ModId from '../../../../typings/mod-id.enum';
import { GlobalStateModel } from '../../../../core/models/global-state.model';
import { SkillTree } from '../../../../core/domains/mods/skilltree/skill-tree';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const skillTreeMod = useQuery(ModModel, (obj) =>
    obj.filtered(
      'modId = $0 AND project = $1',
      ModId.PassiveSkillTree,
      globalState.selectedProjectId!,
    ),
  )[0];

  useEffect(() => {
    onInit();
  }, []);

  const onInit = async () => {
    try {
      if (skillTreeMod) {
        setLoading(true);
        const config = skillTreeMod.getConfig();

        if (!config.initialized) {
          await SkillTree.initializeConfig(skillTreeMod, config);
        }
      } else {
        setLoadFailed(true);
      }
    } catch (err) {
      console.error(err);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="mb-20" />
      </div>
    );
  }

  if (loadFailed) {
    return <>Load failed</>;
  }

  return (
    <>
      <h1 className="font-bold text-lg">Tree Configuration</h1>
      <Button className="mb-3 w-72 mt-1" onPress={() => navigate('edit-tree')}>
        Edit tree
      </Button>
    </>
  );
}
