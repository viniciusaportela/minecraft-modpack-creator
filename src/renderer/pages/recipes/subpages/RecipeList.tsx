import { Button } from '@nextui-org/react';
import { Plus } from '@phosphor-icons/react';
import { useProjectStore } from '../../../store/project.store';
import RecipeCard from '../components/RecipeCard';
import { usePager } from '../../../components/pager/hooks/usePager';
import Title from '../../../components/title/Title';

export default function RecipeList() {
  const { navigate } = usePager();

  const recipes = useProjectStore((st) => {
    return st?.recipes;
  });

  return (
    <>
      <Title>Your custom recipes</Title>

      {recipes.length === 0 && (
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

      {recipes.length > 0 && (
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
          {recipes.map((r, index) => (
            <RecipeCard
              index={index}
              type={r.type}
              input={r.input}
              output={r.output}
              outputCount={r.outputCount}
            />
          ))}
        </div>
      )}
    </>
  );
}
