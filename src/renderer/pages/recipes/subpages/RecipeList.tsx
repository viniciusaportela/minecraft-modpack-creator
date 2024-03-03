import { Button } from '@nextui-org/react';
import { Plus } from '@phosphor-icons/react';
import RecipeCard from '../components/RecipeCard';
import { usePager } from '../../../components/pager/hooks/usePager';
import Title from '../../../components/title/Title';
import { useQueryById, useQueryFirst } from '../../../hooks/realm.hook';
import { GlobalStateModel } from '../../../core/models/global-state.model';
import { ProjectModel } from '../../../core/models/project.model';

export default function RecipeList() {
  const { navigate } = usePager();

  const globalState = useQueryFirst(GlobalStateModel);
  const project = useQueryById(ProjectModel, globalState.selectedProjectId!)!;

  return (
    <>
      <Title>Your custom recipes</Title>

      {project.recipes.length === 0 && (
        <Button
          className="border-1 border-dashed border-zinc-700 h-fit w-full p-5 mt-3"
          variant="light"
          onPress={() => navigate('add-recipe-list')}
        >
          <div className="flex flex-col gap-1">
            <i className="text-zinc-500">No recipes found.</i>
            <div className="flex items-center gap-1">
              <Plus />
              <span className="font-bold">Create or customize recipes</span>
            </div>
          </div>
        </Button>
      )}

      {project.recipes.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          <Button
            className="border-1 border-dashed border-zinc-700 h-fit w-full p-5 mt-3"
            variant="light"
            onPress={() => navigate('add-recipe-list')}
          >
            <div className="flex gap-1 items-center">
              <Plus />
              <span className="font-bold">New recipe</span>
            </div>
          </Button>
          {project.getRecipes().map((r, index) => (
            <RecipeCard onDelete={() => project.removeRecipe(index)} />
          ))}
        </div>
      )}
    </>
  );
}
