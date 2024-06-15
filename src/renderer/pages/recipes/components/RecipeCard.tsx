import React, { CSSProperties, memo } from 'react';
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import {
  ArrowCounterClockwise,
  DotsThree,
  PencilSimple,
  TrashSimple,
} from '@phosphor-icons/react';
import path from 'path';
import clsx from 'clsx';
import { GridChildComponentProps } from 'react-window';
import { IRecipe } from '../../../store/interfaces/recipes-store.interface';
import NoRecipe from '../../../assets/no-recipe.png';
import { TextureLoader } from '../../../core/domains/minecraft/texture/texture-loader';
import LazyTexture from '../../../components/lazy-texture/LazyTexture';
import { useItemsStore } from '../../../store/items.store';
import Block3D from '../../../components/block-3d/Block3D';
import {
  IDeleteRecipe,
  IEditRecipe,
} from '../../../store/interfaces/project-store.interface';

interface RecipeCardProps {
  recipe: IRecipe;
  onSelect?: (recipe: IRecipe) => void;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  isSelected?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
  onRestore?: (recipe: IRecipe) => void;
}

export const RecipeCardItemWrapper = memo(
  ({ style, rowIndex, columnIndex, data }: GridChildComponentProps) => {
    const recipe: IRecipe =
      data.filteredRecipes[
        rowIndex * Math.floor(data.width / 260) + columnIndex
      ];

    return (
      <RecipeCard
        recipe={recipe}
        wrapperStyle={{ ...style, paddingLeft: 10 }}
        onSelect={data.onSelectRecipe}
        isSelected={data.selectedRecipes.includes(recipe.index)}
        style={{ marginTop: 10 }}
        onRestore={data.onRestoreRecipe}
        isDeleted={data.deletedRecipes.some(
          (r: IDeleteRecipe) => r.filePath === recipe.filePath,
        )}
        isEdited={
          !!data.editedRecipes.some(
            (r: IEditRecipe) => r.filePath === recipe.filePath,
          )
        }
      />
    );
  },
);

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  style,
  onSelect,
  isSelected,
  wrapperStyle,
  isEdited,
  isDeleted,
  onRestore,
}) => {
  const getImage = () => {
    // TODO Has to adapt if item is a block instead
    if (recipe.result?.item) {
      const foundItem = useItemsStore.getState().findItem(recipe.result.item);

      if (foundItem?.isBlock) {
        return (
          <Block3D
            textureId={TextureLoader.getInstance().getTextureFromBlock(
              foundItem.id,
            )}
            size={28}
            className="mt-3 ml-2"
          />
        );
      }

      return (
        <LazyTexture
          textureId={
            TextureLoader.getInstance().getTextureFromItem(
              recipe.result.item,
            ) || null
          }
          className="w-[50px] h-[50px]"
          fallback={NoRecipe}
        />
      );
    }

    return (
      <LazyTexture
        textureId={null}
        className="w-[50px] h-[50px]"
        fallback={NoRecipe}
      />
    );
  };

  const getTitle = (full?: true) => {
    return `${path.basename(recipe.filePath).replace('.json', '')}${full && recipe.type ? ` (${recipe.type})` : ''}`;
  };

  return (
    <div style={wrapperStyle}>
      <Card
        isPressable
        className={clsx(
          'w-[260px] h-[100px]',
          isSelected && 'outline-primary-400',
        )}
        style={style}
        onPress={() => onSelect?.(recipe)}
      >
        <CardBody>
          <div className="flex flex-col h-full">
            <Tooltip
              content={getTitle(true)}
              className="tooltip-not-selectable"
            >
              <span
                className={clsx(
                  'overflow-hidden text-ellipsis text-nowrap',
                  isDeleted && 'text-red-400',
                  isEdited && 'text-primary-400',
                )}
              >
                {getTitle()}
              </span>
            </Tooltip>
            <div className="flex flex-1 justify-stretch mt-1">
              {getImage()}
              <div className="flex items-end justify-end flex-1 gap-1">
                {(isDeleted || isEdited) && (
                  <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    onPress={() => onRestore?.(recipe)}
                  >
                    <ArrowCounterClockwise />
                  </Button>
                )}
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <DotsThree />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem startContent={<PencilSimple />} key="edit">
                      Edit
                    </DropdownItem>
                    <DropdownItem startContent={<TrashSimple />} key="delete">
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
