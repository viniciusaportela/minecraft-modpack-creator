import { memo } from 'react';
import ModId from '../../typings/mod-id.enum';
import RecipeList from './subpages/RecipeList';
import { Page, Pager } from '../../components/pager/Pager';
import RecipeForm from './subpages/RecipeForm';
import Alert from '../../components/alert/Alert';
import { useModsStore } from '../../store/mods.store';

const Recipes = memo(() => {
  const mods = useModsStore((st) => Object.values(st.mods));
  const kubeJSMod = mods.find((mod) => mod.id === ModId.KubeJS);

  if (!kubeJSMod) {
    return (
      <>
        <h1 className="text-xl font-bold">Your custom recipes</h1>
        <Alert
          className="mt-3"
          text="You don't have KubeJS installed or enabled. You need it to create
            custom recipes."
        />
      </>
    );
  }

  return (
    <Pager initialPage="dashboard">
      <Page name="recipe-list">
        <RecipeList />
      </Page>
      <Page name="recipe-form">
        <RecipeForm />
      </Page>
    </Pager>
  );
});

export default Recipes;
