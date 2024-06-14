import { TextureLoader } from '../../core/domains/minecraft/texture/texture-loader';

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
      <div
        className="absolute text-center bg-red-700"
        style={{
          transform: `rotateX(90deg) translateZ(${(size ?? 16) / 2}px)`,
          background: `url('${texture}')`,
          width: size ?? '16px',
          height: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
        }}
      />
      <div
        className="absolute text-center bg-blue-600"
        style={{
          transform: `rotateY(-90deg) translateZ(${(size ?? 16) / 2}px)`,
          background: `url('${texture}')`,
          width: size ?? '16px',
          height: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
        }}
      />
      <div
        className="absolute text-center bg-green-600"
        style={{
          transform: `translateZ(${(size ?? 16) / 2}px)`,
          background: `url('${texture}')`,
          width: size ?? '16px',
          height: size ?? '16px',
          lineHeight: size ?? '16px',
          fontSize: size ?? '16px',
        }}
      />
    </div>
  );
}
