import { Button, Card, CardBody } from '@nextui-org/react';
import { Trash } from '@phosphor-icons/react';

export interface RecipeCardProps {
  onDelete: () => void;
}

export default function RecipeCard({ onDelete }: RecipeCardProps) {
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
