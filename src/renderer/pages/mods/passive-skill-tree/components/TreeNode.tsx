import { Handle, Position, useStore } from 'reactflow';
import { memo, useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import { ipcRenderer } from 'electron';

export default memo(({ data }: { data: any }) => {
  const isConnecting = useStore((state) => !!state.connectionNodeId);
  const [iconImg, setIconImg] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);

  useEffect(() => {
    (async () => {
      const [modId, path] = data.iconTexture.split(':textures/');
      const texturePath = data.iconTexture.replace('skilltree:textures/', '');
      const backgroundPath = data.backgroundTexture.replace(
        'skilltree:textures/',
        '',
      );
      console.log(texturePath);

      const texture = await ipcRenderer.invoke(
        'loadTexture',
        'skilltree',
        `${data.modpackFolder}/mods/PassiveSkillTree-1.20.1-BETA-0.6.10a-all.jar`,
        texturePath,
      );

      setIconImg(texture);

      const texture2 = await ipcRenderer.invoke(
        'loadTexture',
        'skilltree',
        `${data.modpackFolder}/mods/PassiveSkillTree-1.20.1-BETA-0.6.10a-all.jar`,
        backgroundPath,
      );

      setBackgroundImg(texture2);
    })();
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
      {iconImg && (
        <Image
          src={iconImg}
          className="pixelated h-3 w-3 object-contain rounded-none"
        />
      )}

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
