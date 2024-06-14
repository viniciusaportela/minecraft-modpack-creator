import React, { CSSProperties } from 'react';
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { DotsThree, PencilSimple, TrashSimple } from '@phosphor-icons/react';
import { IRecipe } from '../../../store/interfaces/recipes-store.interface';
import NoRecipe from '../../../assets/no-recipe.png';
import { TextureLoader } from '../../../core/domains/minecraft/texture/texture-loader';
import LazyTexture from '../../../components/lazy-texture/LazyTexture';

interface RecipeCardProps {
  recipe: IRecipe;
  onSelect?: (recipe: IRecipe) => void;
  style?: CSSProperties;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, style }) => {
  const getImage = () => {
    // Has to adapt if item is a block instead
    if (recipe.result?.item) {
      return TextureLoader.getInstance().getTextureFromItem(recipe.result.item);
    }

    return null;
  };

  return (
    <Card className="w-[260px] h-[100px]" style={style}>
      <CardBody>
        <div className="flex">
          <LazyTexture
            textureId={getImage() || null}
            className="w-[50px] h-[50px]"
            fallback={NoRecipe}
          />
          <div className="flex flex-col items-end flex-1">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <DotsThree />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="delete">Delete</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
