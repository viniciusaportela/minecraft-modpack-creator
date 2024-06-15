import { Image } from '@nextui-org/react';
import { useState } from 'react';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';
import NoRecipe from '../../assets/no-recipe.png';

interface TextureBoxProps {
  textureId: string;
  className?: string;
  size?: number;
}

export default function Block3D({
  textureId,
  className,
  size,
}: TextureBoxProps) {
  const texture = TextureLoader.getInstance().getTextureSource(textureId, true);

  const [fallbackImage, setFallbackImage] = useState<string | null>(null);

  const handleImageError = () => {
    setFallbackImage(NoRecipe);
  };

  return (
    <div
      style={{
        width: size ?? '16px',
        height: size ?? '16px',
        transformStyle: 'preserve-3d',
        position: 'relative',
        transform: 'rotateX(-30deg) rotateY(45deg)',
      }}
      className={className}
    >
      <Image
        src={fallbackImage ?? texture}
        fallbackSrc={NoRecipe}
        removeWrapper
        onError={handleImageError}
        className="rounded-none absolute"
        style={{
          transform: `rotateX(90deg) translateZ(${(size ?? 16) / 2}px)`,
          backgroundSize: 'cover',
          width: size ?? '16px',
          height: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
          filter: 'brightness(55%)',
        }}
      />
      <Image
        src={fallbackImage ?? texture}
        onError={handleImageError}
        removeWrapper
        classNames={{
          wrapper: 'bg-cover absolute w-[16px] h-[16px]',
        }}
        className="rounded-none absolute"
        style={{
          transform: `rotateY(-90deg) translateZ(${(size ?? 16) / 2}px)`,
          width: size ?? '16px',
          height: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
        }}
      />
      <Image
        src={fallbackImage ?? texture}
        onError={handleImageError}
        fallbackSrc={NoRecipe}
        removeWrapper
        className="rounded-none absolute"
        style={{
          transform: `translateZ(${(size ?? 16) / 2}px)`,
          width: size ?? '16px',
          height: size ?? '16px',
          minWidth: size ?? '16px',
          minHeight: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
          filter: 'brightness(35%)',
        }}
      />
    </div>
  );
}
