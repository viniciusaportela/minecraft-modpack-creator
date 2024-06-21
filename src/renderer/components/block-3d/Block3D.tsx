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

  const realSize = (size ?? 16) * 0.8;

  return (
    <div
      className={className}
      style={{
        transform: 'translateX(2px)',
        width: size ?? 16,
        height: size ?? 16,
      }}
    >
      <div
        className="relative"
        style={{
          width: realSize ?? '16px',
          height: realSize ?? '16px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-30deg) rotateY(45deg)',
        }}
      >
        <Image
          src={fallbackImage ?? texture}
          fallbackSrc={NoRecipe}
          removeWrapper
          onError={handleImageError}
          className="rounded-none absolute"
          style={{
            transform: `rotateX(90deg) translateZ(${(realSize ?? 16) / 2}px)`,
            backgroundSize: 'cover',
            width: realSize ?? '16px',
            height: realSize ?? '16px',
            lineHeight: realSize ?? '16px',
            fontSize: realSize ?? '16px',
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
            transform: `rotateY(-90deg) translateZ(${(realSize ?? 16) / 2}px)`,
            width: realSize ?? '16px',
            height: realSize ?? '16px',
            lineHeight: realSize ?? '16px',
            fontSize: realSize ?? '16px',
          }}
        />
        <Image
          src={fallbackImage ?? texture}
          onError={handleImageError}
          fallbackSrc={NoRecipe}
          removeWrapper
          className="rounded-none absolute"
          style={{
            transform: `translateZ(${(realSize ?? 16) / 2}px)`,
            width: realSize ?? '16px',
            height: realSize ?? '16px',
            minWidth: realSize ?? '16px',
            minHeight: realSize ?? '16px',
            lineHeight: realSize ?? '16px',
            fontSize: realSize ?? '16px',
            filter: 'brightness(35%)',
          }}
        />
      </div>
    </div>
  );
}
