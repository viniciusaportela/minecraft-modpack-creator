import { Image } from '@nextui-org/react';
import clsx from 'clsx';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';
import NoRecipe from '../../assets/no-recipe.png';

interface ILazyTextureProps {
  textureId: string | null | undefined;
  className?: string;
  fallback?: string;
}

export default function LazyTexture({
  textureId,
  className,
  fallback,
}: ILazyTextureProps) {
  const texturePath = TextureLoader.getInstance().getTextureSource(textureId);

  if (!texturePath) {
    return <Image src={fallback} className={clsx(className, 'pixelated')} />;
  }

  return (
    <Image
      src={texturePath}
      fallbackSrc={NoRecipe}
      className={clsx(className, 'rounded-none pixelated bg-img-inherit')}
      classNames={{
        wrapper: 'bg-cover',
      }}
    />
  );
}
