import { Image } from '@nextui-org/react';
import { Placeholder } from '@phosphor-icons/react';
import clsx from 'clsx';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';

interface ILazyTextureProps {
  path: string | null | undefined;
  className?: string;
}

export default function LazyTexture({ path, className }: ILazyTextureProps) {
  const texturePath = TextureLoader.getInstance().getTextureSource(path);

  if (!texturePath) {
    return <Placeholder className={className} />;
  }

  return (
    <Image src={texturePath} className={clsx(className, 'rounded-none')} />
  );
}
