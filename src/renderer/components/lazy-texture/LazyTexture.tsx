import { Image } from '@nextui-org/react';
import clsx from 'clsx';
import { CSSProperties } from 'react';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';
import NoRecipe from '../../assets/no-recipe.png';

interface ILazyTextureProps {
  textureId: string | null | undefined;
  className?: string;
  fallback?: string;
  style?: CSSProperties;
}

export default function LazyTexture({
  textureId,
  className,
  fallback,
  style,
}: ILazyTextureProps) {
  const texturePath = TextureLoader.getInstance().getTextureSource(textureId);

  if (!texturePath) {
    return (
      <Image
        src={fallback ?? NoRecipe}
        style={style}
        className={clsx(className, 'pixelated')}
      />
    );
  }

  return (
    <Image
      style={style}
      src={texturePath}
      fallbackSrc={NoRecipe}
      className={clsx(className, 'rounded-none pixelated')}
      classNames={{
        wrapper: 'bg-cover',
      }}
    />
  );
}
