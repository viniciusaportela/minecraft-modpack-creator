import { Warning } from '@phosphor-icons/react';
import ModId from '../../typings/mod-id.enum';
import { useAppStore } from '../../store/app.store';
import RecipeList from './subpages/RecipeList';
import { Page, Pager } from '../../components/pager/Pager';
import AddRecipeList from './subpages/AddRecipeList';
import AddShaped from './subpages/AddShaped';

interface IRecipeProps {
  isVisible: boolean;
}

export default function Recipes({ isVisible }: IRecipeProps) {
  const projectMeta = useAppStore((st) => st.projectMeta);
  const isKubeJSEnabled = projectMeta?.installedAddons.find(
    (mod) => mod.addonID === ModId.KubeJS,
  );

  return (
    <div
      className="p-5 pt-0"
      style={{ display: isVisible ? undefined : 'none' }}
    >
      {!isKubeJSEnabled && (
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

      {isKubeJSEnabled && (
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
      )}
    </div>
  );
}
