import { memo } from 'react';
import clsx from 'clsx';
import { PickerType } from '../../typings/picker-type.enum';
import Block3D from '../block-3d/Block3D';
import LazyTexture from '../lazy-texture/LazyTexture';
import { useTagsStore } from '../../store/tags.store';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';

interface MinecraftTextureProps {
  type: PickerType;
  value: string;
  className?: string;
  size?: number;
  classNames?: {
    block3D?: string;
    lazyTexture?: string;
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
      if ([PickerType.Tag, PickerType.ItemTag].includes(type)) {
        const firstItemOfTag = useTagsStore
          .getState()
          .tags.find((t) => t.name === value)?.items[0];

        console.log('tag/item tag?', type, value, firstItemOfTag);

        if (firstItemOfTag) {
          return (
            <ItemMinecraftTexture
              value={firstItemOfTag!}
              size={size}
              className={className}
              classNames={classNames}
            />
          );
        }
      }

      if ([PickerType.Item, PickerType.ItemTag].includes(type)) {
        return (
          <ItemMinecraftTexture
            value={value}
            size={size}
            className={className}
            classNames={classNames}
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

      if (type === PickerType.ItemTag) {
        const isTag = useTagsStore
          .getState()
          .tags.some((t) => t.name === value);

        if (isTag) {
          return (
            <LazyTexture
              textureId={null}
              style={{ width: size, height: size }}
              className={clsx('h-6 w-6', className, classNames?.lazyTexture)}
            />
          );
        }
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

interface ItemMinecraftTextureProps {
  value: string;
  size?: number;
  className?: string;
  classNames?: {
    block3D?: string;
    lazyTexture?: string;
  };
}

const ItemMinecraftTexture = memo(
  ({ value, size, classNames, className }: ItemMinecraftTextureProps) => {
    const { isBlock, textureId } =
      TextureLoader.getInstance().getTextureFromItem(value);

    console.log(
      'item minecraft',
      value,
      isBlock,
      textureId,
      TextureLoader.getInstance().getTextureSource(textureId),
    );

    return isBlock ? (
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
          'h-6 w-6 object-contain max-w-[none]',
          className,
          classNames?.lazyTexture,
        )}
      />
    );
  },
);

export default MinecraftTexture;
