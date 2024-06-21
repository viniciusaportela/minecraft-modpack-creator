import { ShapedPreview } from './ShapedPreview';
import LazyTexture from '../../../../components/lazy-texture/LazyTexture';
import { RecipePreviewProps } from './interfaces/RecipePreviewProps';

export const RecipePreview = ({ recipe }: RecipePreviewProps) => {
  if (recipe.type === 'minecraft:crafting_shaped') {
    return <ShapedPreview recipe={recipe} />;
  }

  return <LazyTexture textureId={null} className="w-[50px] h-[50px]" />;
};
