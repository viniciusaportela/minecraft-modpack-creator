import { Button, Card, CardBody } from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react';
import { ICustomRecipe } from '../../../store/interfaces/project-store.interface';

export interface RecipeCardProps {
  customRecipe?: ICustomRecipe;
  onDelete?: () => void;
}

export default function CustomRecipeCard({
  onDelete,
  customRecipe,
}: RecipeCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <span>Recipe</span>
          <Button onPress={onDelete} isIconOnly className="ml-auto">
            <Trash />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
