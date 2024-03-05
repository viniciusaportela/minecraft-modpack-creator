import { Image } from '@nextui-org/react';
import { useLayoutEffect, useState } from 'react';
import { Placeholder } from '@phosphor-icons/react';
import clsx from 'clsx';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';
import { useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';

interface ILazyTextureProps {
  textureId: string;
  className?: string;
}

export default function LazyTexture({
  textureId,
  className,
}: ILazyTextureProps) {
  const globalState = useQueryFirst(GlobalStateModel);

  const [src, setSrc] = useState<string | undefined>(undefined);

  const texture = TextureLoader.getTextureSource(textureId);

  useLayoutEffect(() => {
    if (textureId) {
      TextureLoader.load(globalState.selectedProjectId!, textureId)
        .then(() => setSrc(texture))
        .catch(console.warn);
    }
  }, [textureId]);

  if (!src) {
    return <Placeholder className={className} />;
  }

  return <Image src={src} className={clsx(className, 'rounded-none')} />;
}
