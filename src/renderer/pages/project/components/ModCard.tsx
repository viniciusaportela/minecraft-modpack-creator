import { Card, CardBody, Image } from '@nextui-org/react';
import path from 'path';
import React, { CSSProperties } from 'react';
import NoThumb from '../../../assets/no-thumb.png';
import { IMod } from '../../../store/interfaces/mods-store.interface';

interface ModCardProps {
  mod: IMod;
  onClickMod?: (mod: IMod) => void;
  style?: CSSProperties;
}

export const ModCard: React.FC<ModCardProps> = ({ mod, onClickMod, style }) => {
  return (
    <Card
      className="w-full h-[70px]"
      isPressable
      key={mod.name}
      isHoverable
      style={style}
      onPress={() => onClickMod?.(mod)}
    >
      <CardBody className="min-h-fit flex flex-row overflow-hidden">
        <Image
          src={
            mod.icon ? `textures:${path.sep}${path.sep}${mod.icon}` : NoThumb
          }
          className="w-full h-full object-contain"
          classNames={{
            wrapper: 'min-w-10 min-h-10 w-10 h-10 mr-3',
          }}
        />
        <span className="font-bold text-left flex-1 text-ellipsis overflow-hidden text-wrap">
          {mod.name}
        </span>
      </CardBody>
    </Card>
  );
};
