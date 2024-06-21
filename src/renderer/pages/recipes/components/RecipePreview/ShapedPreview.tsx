import { ArrowFatRight } from '@phosphor-icons/react';
import MinecraftTexture from '../../../../components/minecraft-texture/minecraft-texture';
import { PickerType } from '../../../../typings/picker-type.enum';
import { RecipePreviewProps } from './interfaces/RecipePreviewProps';

export const ShapedPreview = ({ recipe }: RecipePreviewProps) => {
  const getItemIn = (row: number, col: number) => {
    const curRow = recipe.pattern[row];
    return curRow && curRow[col] !== ' '
      ? recipe.key[curRow[col]]?.item ??
          recipe.key[curRow[col]]?.tag ??
          recipe.key[curRow[col]]
      : null;
  };

  console.log('ShapedPreview', recipe, getItemIn(0, 0));

  return (
    <div className="flex items-center gap-2">
      <div className="w-[50px] h-full relative mt-2">
        <MinecraftTexture
          type={PickerType.ItemTag}
          value={getItemIn(0, 0)}
          size={8}
          className="absolute top-0 left-[2px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(0, 1)}
          className="absolute top-0 left-[18px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(0, 2)}
          className="absolute top-0 left-[34px]"
        />

        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(1, 0)}
          className="absolute top-[16px] left-[2px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(1, 1)}
          className="absolute top-[16px] left-[18px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(1, 2)}
          className="absolute top-[16px] left-[34px]"
        />

        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(2, 0)}
          className="absolute top-[30px] left-[2px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(2, 1)}
          className="absolute top-[30px] left-[18px]"
        />
        <MinecraftTexture
          type={PickerType.ItemTag}
          size={8}
          value={getItemIn(2, 2)}
          className="absolute top-[30px] left-[34px]"
        />
      </div>
      <ArrowFatRight weight="fill" className="mr-2" />
      <div>
        <MinecraftTexture
          type={PickerType.ItemTag}
          value={recipe.result.item}
        />
      </div>
    </div>
  );
};
