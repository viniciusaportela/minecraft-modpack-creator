import { Handle, Position, useStore } from 'reactflow';
import { memo, useLayoutEffect, useState } from 'react';
import LazyTexture from '../../../../components/lazy-image/LazyTexture';
import { TextureLoader } from '../../../../core/domains/minecraft/texture/texture-loader';

export default memo(({ data }: { data: any }) => {
  const isConnecting = useStore((state) => !!state.connectionNodeId);
  const [backgroundImg, setBackgroundImg] = useState<string | null>(null);

  useLayoutEffect(() => {
    const textureId = data.backgroundTexture
      .replace('textures/', '')
      .replace('.png', '');
    TextureLoader.load(data.projectId, textureId).then(() => {
      setBackgroundImg(TextureLoader.getTextureSource(textureId) as string);
    });
  }, []);

  return (
    <div
      className="w-5 h-5 flex items-center justify-center relative pixelated"
      style={
        backgroundImg
          ? {
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: '3.75rem 1.25rem',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0px 0px',
            }
          : undefined
      }
    >
      <LazyTexture
        textureId={data.iconTexture
          .replace('textures/', '')
          .replace('.png', '')}
        projectId={data.projectId}
        className="pixelated h-3 w-3 object-contain rounded-none"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="main-source"
        style={{
          visibility: isConnecting ? 'hidden' : 'visible',
          position: 'absolute',
          transform: 'none',
          backgroundColor: 'red',
          width: '50%',
          height: '50%',
          zIndex: 1,
          right: 0,
          top: 0,
        }}
      />

      <Handle
        type="target"
        position={Position.Bottom}
        id="main-target"
        style={{
          visibility: isConnecting ? 'visible' : 'hidden',
          position: 'absolute',
          transform: 'none',
          backgroundColor: 'blue',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
});
