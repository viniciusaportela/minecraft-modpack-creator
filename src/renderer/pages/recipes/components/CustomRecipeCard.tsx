import { Button, Card, CardBody } from '@nextui-org/react';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import { ICustomRecipe } from '../../../store/interfaces/project-store.interface';

export interface RecipeCardProps {
  customRecipe: ICustomRecipe;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function CustomRecipeCard({
  onDelete,
  customRecipe,
  onEdit,
}: RecipeCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <span>{customRecipe.name}</span>
          <Button onPress={onEdit} isIconOnly className="ml-auto">
            <PencilSimple />
          </Button>
          <Button onPress={onDelete} isIconOnly className="ml-auto">
            <Trash />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
