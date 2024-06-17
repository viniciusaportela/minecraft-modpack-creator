import { memo } from 'react';
import clsx from 'clsx';
import { PickerType } from '../../typings/picker-type.enum';
import Block3D from '../block-3d/Block3D';
import LazyTexture from '../lazy-texture/LazyTexture';
import { useItemsStore } from '../../store/items.store';

interface MinecraftTextureProps {
  type: PickerType;
  value: string;
  className?: string;
  size?: number;
  classNames?: {
    block3D: string;
    lazyTexture: string;
  };
}

const MinecraftTexture = memo(
  ({
    type,
    value,
    className,
    classNames,
    size = 16,
  }: MinecraftTextureProps) => {
    if (typeof value === 'string') {
      if (type === PickerType.Item) {
        const item = useItemsStore((st) =>
          st.items.find((i) => i.id === value),
        );

        const modId = item?.mod;
        const withoutModId = value.split(':')[1];

        const textureId = `${modId}:textures/${item?.isBlock ? 'block' : 'item'}/${withoutModId}.png`;

        return item?.isBlock ? (
          <Block3D
            textureId={textureId}
            size={size}
            className={clsx('h-6 w-6', className, classNames?.block3D)}
          />
        ) : (
          <LazyTexture
            textureId={textureId}
            style={{ width: size, height: size }}
            className={clsx(
              'h-6 w-6 object-contain',
              className,
              classNames?.lazyTexture,
            )}
          />
        );
      }

      if (
        [
          PickerType.Texture,
          PickerType.SkillTreeBackground,
          PickerType.SkillTreeBorder,
          PickerType.SkillTreeIcon,
        ].includes(type)
      ) {
        return (
          <LazyTexture
            textureId={value}
            style={{ width: size, height: size }}
            className={clsx('h-6 w-6', className, classNames?.lazyTexture)}
          />
        );
      }
    }

    return (
      <LazyTexture
        style={{ width: size, height: size }}
        textureId={null}
        className={clsx('h-6 w-6', className, classNames?.lazyTexture)}
      />
    );
  },
);

export default MinecraftTexture;
