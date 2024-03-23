import { Warning } from '@phosphor-icons/react';
import ModId from '../../typings/mod-id.enum';
import RecipeList from './subpages/RecipeList';
import { Page, Pager } from '../../components/pager/Pager';
import AddRecipeList from './subpages/AddRecipeList';
import AddShaped from './subpages/AddShaped';
import { useQuery, useQueryById, useQueryFirst } from '../../hooks/realm.hook';
import { ProjectModel } from '../../core/models/project.model';
import { GlobalStateModel } from '../../core/models/global-state.model';
import { ModModel } from '../../core/models/mod.model';
import { ModConfigProvider } from '../../store/mod-config-provider';

interface IRecipeProps {
  isVisible: boolean;
}

export default function Recipes({ isVisible }: IRecipeProps) {
  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;
  const mods = useQuery(ModModel, (obj) =>
    obj.filtered('modId != $0 AND project = $1', ModId.Minecraft, project._id),
  );

  const kubeJSMod = mods.find((mod) => mod.modId === ModId.KubeJS);

  return (
    <div
      className="p-5 pt-0"
      style={{ display: isVisible ? undefined : 'none' }}
    >
      {!kubeJSMod && (
        <>
          <h1 className="text-xl font-bold">Your custom recipes</h1>
          <div className="bg-danger mt-3 p-3 rounded-md flex items-center drop-shadow-md">
            <Warning size={20} weight="bold" />
            <span className="ml-2">
              You don't have KubeJS installed or enabled. You need it to create
              custom recipes.
            </span>
          </div>
        </>
      )}

      {kubeJSMod && (
        <ModConfigProvider mod={kubeJSMod}>
          <Pager initialPage="dashboard">
            <Page name="recipe-list">
              <RecipeList />
            </Page>
            <Page name="add-recipe-list">
              <AddRecipeList />
            </Page>
            <Page name="add-shaped-recipe">
              <AddShaped />
            </Page>
          </Pager>
        </ModConfigProvider>
      )}
    </div>
  );
}
