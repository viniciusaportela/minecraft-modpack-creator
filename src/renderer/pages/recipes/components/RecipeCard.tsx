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
import {
  ICustomRecipe,
  IDeleteRecipe,
  IEditRecipe,
  isCustomRecipe,
} from '../../../store/interfaces/project-store.interface';
import { RecipePreview } from './RecipePreview/RecipePreview';

export const RecipeCardItemWrapper = memo(
  ({ style, rowIndex, columnIndex, data }: GridChildComponentProps) => {
    const recipe: IRecipe =
      data.data[rowIndex * Math.floor(data.width / 260) + columnIndex];

    if (!recipe) return null;

    return (
      <RecipeCard
        recipe={isCustomRecipe(recipe) ? JSON.parse(recipe.json) : recipe}
        wrapperStyle={{ ...style, paddingLeft: columnIndex === 0 ? 0 : 10 }}
        onSelect={data.onSelectRecipe}
        isSelected={data.selectedRecipes?.includes(recipe.index)}
        style={{ marginTop: 10 }}
        onRestore={data.onRestoreRecipe}
        onDelete={data.onDelete}
        onEdit={data.onEdit}
        customRecipe={isCustomRecipe(recipe) ? recipe : undefined}
        isDeleted={data.deletedRecipes?.some(
          (r: IDeleteRecipe) => r.filePath === recipe.filePath,
        )}
        isEdited={
          !!data.editedRecipes?.some(
            (r: IEditRecipe) => r.filePath === recipe.filePath,
          )
        }
      />
    );
  },
);

interface RecipeCardProps {
  recipe: IRecipe;
  onSelect?: (recipe: IRecipe | ICustomRecipe) => void;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  isSelected?: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
  onRestore?: (recipe: IRecipe | ICustomRecipe) => void;
  onEdit?: (recipe: IRecipe | ICustomRecipe) => void;
  onDelete?: (recipe: IRecipe | ICustomRecipe) => void;
  customRecipe?: ICustomRecipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  style,
  onSelect,
  isSelected,
  wrapperStyle,
  isEdited,
  isDeleted,
  onDelete,
  onEdit,
  onRestore,
  customRecipe,
}) => {
  const getTitle = (full?: true) => {
    return (
      customRecipe?.name ??
      `${path.basename(recipe.filePath).replace('.json', '')}${full && recipe.type ? ` (${recipe.type})` : ''}`
    );
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
        onPress={() => onSelect?.(customRecipe ?? recipe)}
      >
        <CardBody>
          <div className="flex flex-col h-full overflow-y-hidden overflow-x-visible">
            <Tooltip
              content={getTitle(true)}
              className="tooltip-not-selectable"
            >
              <span
                className={clsx(
                  'overflow-hidden text-ellipsis text-nowrap',
                  isDeleted && 'text-zinc-800',
                  isEdited && 'text-yellow-300',
                )}
              >
                {getTitle()}
              </span>
            </Tooltip>
            <div className="flex flex-1 justify-stretch mt-1">
              <RecipePreview recipe={recipe} />
              <div className="flex items-end justify-end flex-1 gap-1">
                {(isDeleted || isEdited) && (
                  <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    onPress={() => onRestore?.(customRecipe ?? recipe)}
                  >
                    <ArrowCounterClockwise />
                  </Button>
                )}
                {customRecipe ? (
                  <Button
                    color="danger"
                    isIconOnly
                    size="sm"
                    onPress={() => onDelete?.(customRecipe)}
                  >
                    <TrashSimple />
                  </Button>
                ) : (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <DotsThree />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      onAction={(key) => {
                        if (key === 'edit') onEdit?.(customRecipe ?? recipe);
                        if (key === 'delete')
                          onDelete?.(customRecipe ?? recipe);
                      }}
                    >
                      <DropdownItem startContent={<PencilSimple />} key="edit">
                        Edit
                      </DropdownItem>
                      <DropdownItem startContent={<TrashSimple />} key="delete">
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
