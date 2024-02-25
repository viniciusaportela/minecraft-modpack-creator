import { Warning } from '@phosphor-icons/react';
import { useState } from 'react';
import ModId from '../../typings/mod-id.enum';
import { useAppStore } from '../../store/app.store';
import RecipeList from './components/RecipeList';
import AddRecipe from './components/add-recipe/AddRecipe';

export default function Recipes() {
  const [page, setPage] = useState<'recipes' | 'add-recipe'>('recipes');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const projectMeta = useAppStore((st) => st.projectMeta);
  const isKubeJSEnabled = projectMeta?.installedAddons.find(
    (mod) => mod.addonID === ModId.KubeJS && mod.status !== 5,
  );

  return (
    <div className="p-5 pt-0">
      {isKubeJSEnabled && (
        <>
          {page === 'recipes' && <RecipeList setPage={setPage} />}
          {page === 'add-recipe' && <AddRecipe setPage={setPage} />}
        </>
      )}

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
    </div>
  );
}
