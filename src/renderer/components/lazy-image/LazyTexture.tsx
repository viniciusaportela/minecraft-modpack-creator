import { Image } from '@nextui-org/react';
import { useLayoutEffect, useState } from 'react';
import { Types } from 'realm';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';

interface ILazyTextureProps {
  projectId: Types.ObjectId;
  textureId: string;
  className?: string;
}

export default function LazyTexture({
  projectId,
  textureId,
  className,
}: ILazyTextureProps) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  const texture = TextureLoader.getTextureSource(textureId);

  useLayoutEffect(() => {
    if (textureId) {
      TextureLoader.load(projectId, textureId)
        .then(() => setSrc(texture))
        .catch(console.warn);
    }
  }, []);

  return <Image src={src} className={className} />;
}
