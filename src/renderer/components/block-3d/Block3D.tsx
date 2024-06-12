import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';

interface TextureBoxProps {
  textureId: string;
  className?: string;
}

export default function Block3D({ textureId, className }: TextureBoxProps) {
  const texture = TextureLoader.getInstance().getTextureSource(textureId, true);

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
          background: `url('${texture}')`,
        }}
      />
      <div
        className="absolute w-[16px] h-[16px] leading-[16px] text-[16px] text-center bg-blue-600"
        style={{
          transform: 'rotateY(-90deg) translateZ(8px)',
          background: `url('${texture}')`,
        }}
      />
      <div
        className="absolute w-[16px] h-[16px] leading-[16px] text-[16px] text-center bg-green-600"
        style={{
          transform: 'translateZ(8px)',
          background: `url('${texture}')`,
        }}
      />
    </div>
  );
}
