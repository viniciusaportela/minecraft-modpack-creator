import { Button, Card, CardBody } from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react';
import { IProjectStore } from '../../store/interfaces/project-store.interface';
import { useProjectStore } from '../../store/project.store';

export default function RecipeCard({
  index,
}: IProjectStore['recipes'][0] & { index: number }) {
  const deleteRecipe = () => {
    useProjectStore.setState((state) => {
      state.recipes.splice(index, 1);

      return {
        recipes: [...state.recipes],
      };
    });
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <span>Recipe</span>
          <Button onPress={deleteRecipe} isIconOnly className="ml-auto">
            <Trash />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
