import { useLayoutEffect, useState } from 'react';
import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';
import { useQueryFirst } from '../../hooks/realm.hook';
import { GlobalStateModel } from '../../core/models/global-state.model';

interface TextureBoxProps {
  textureId: string;
  className?: string;
}

export default function TextureBox({ textureId, className }: TextureBoxProps) {
  const globalState = useQueryFirst(GlobalStateModel);
  const texture = new TextureLoader().getTextureSource(textureId);

  const [src, setSrc] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (textureId) {
      new TextureLoader()
        .load(globalState.selectedProjectId!, textureId)
        .then(() => setSrc(texture))
        .catch(console.warn);
    }
  }, [textureId]);

  return (
    <div
      style={{
        width: '16px',
        height: '16px',
        transformStyle: 'preserve-3d',
        position: 'relative',
        transform: 'rotateX(-30deg) rotateY(45deg)',
      }}
      className={className}
    >
      <div
        className="absolute w-[16px] h-[16px] leading-[16px] text-[16px] text-center bg-red-700"
        style={{
          transform: 'rotateX(90deg) translateZ(8px)',
          background: `url(${src})`,
        }}
      />
      <div
        className="absolute w-[16px] h-[16px] leading-[16px] text-[16px] text-center bg-blue-600"
        style={{
          transform: 'rotateY(-90deg) translateZ(8px)',
          background: `url(${src})`,
        }}
      />
      <div
        className="absolute w-[16px] h-[16px] leading-[16px] text-[16px] text-center bg-green-600"
        style={{
          transform: 'translateZ(8px)',
          background: `url(${src})`,
        }}
      />
    </div>
  );
}
