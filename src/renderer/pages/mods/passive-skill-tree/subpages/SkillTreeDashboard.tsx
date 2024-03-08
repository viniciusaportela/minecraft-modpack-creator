import { Button, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { usePager } from '../../../../components/pager/hooks/usePager';
import {
  useQuery,
  useQueryById,
  useQueryFirst,
} from '../../../../hooks/realm.hook';
import { ModModel } from '../../../../core/models/mod.model';
import ModId from '../../../../typings/mod-id.enum';
import { GlobalStateModel } from '../../../../core/models/global-state.model';
import { SkillTree } from '../../../../core/domains/mods/skilltree/skill-tree';
import { ProjectModel } from '../../../../core/models/project.model';

export default function SkillTreeDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;
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
          await new SkillTree(project, skillTreeMod).initializeConfig(config);
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

  const reloadTree = async () => {
    setLoading(true);
    try {
      const config = skillTreeMod.getConfig();
      await new SkillTree(project, skillTreeMod).initializeConfig(config);
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
    <div className="flex flex-col">
      <h1 className="font-bold text-lg">Tree Configuration</h1>
      <Button className="w-72 mt-1" onPress={() => navigate('edit-tree')}>
        Edit tree
      </Button>
      <Button className="mb-3 w-72 mt-1" onPress={reloadTree}>
        Reload tree
      </Button>
    </div>
  );
}
