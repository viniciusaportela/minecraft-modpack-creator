import { Handle, Position, useStore } from 'reactflow';
import { memo, useLayoutEffect, useState } from 'react';
import { BSON } from 'realm';
import LazyTexture from '../../../../../components/lazy-texture/LazyTexture';
import { TextureLoader } from '../../../../../core/domains/minecraft/texture/texture-loader';

export default memo(({ data, id }: { data: any; id: string }) => {
  // const connectionNodeId = useStore((state) => state.connectionNodeId);
  const [backgroundImg, setBackgroundImg] = useState<string | null>(null);

  // const isConnecting = !!connectionNodeId;
  // const isTarget = connectionNodeId && connectionNodeId !== id;

  const isConnecting = false;
  const isTarget = false;

  useLayoutEffect(() => {
    const textureId = data.backgroundTexture
      .replace('textures/', '')
      .replace('.png', '');

    new TextureLoader()
      .load(new BSON.ObjectId(data.projectId), textureId)
      .then(() => {
        setBackgroundImg(
          new TextureLoader().getTextureSource(textureId) as string,
        );
      });
  }, [data.backgroundTexture]);

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
        className="pixelated h-3 w-3 object-contain rounded-none"
      />

      <Handle
        type="source"
        position={Position.Top}
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

      {(!isConnecting || isTarget) && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="direct-target"
            style={{
              visibility: isConnecting && isTarget ? 'visible' : 'hidden',
              pointerEvents: isConnecting && isTarget ? 'all' : 'none',
              position: 'absolute',
              transform: 'none',
              backgroundColor: 'green',
              width: '10px',
              height: '10px',
              left: 0,
              top: 0,
            }}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="long-target"
            style={{
              visibility: isConnecting && isTarget ? 'visible' : 'hidden',
              pointerEvents: isConnecting && isTarget ? 'all' : 'none',
              position: 'absolute',
              transform: 'none',
              backgroundColor: 'blue',
              width: '10px',
              height: '10px',
              left: 10,
              top: 10,
            }}
          />
        </>
      )}
    </div>
  );
});
