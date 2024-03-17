import { FunctionWithDefaultConfig } from '../../../interfaces/function-with-default-config';
import { ItemCondition } from '../fields/item-condition/ItemCondition';
import NumberField from '../fields/NumberField';

export const PlayerSockets: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'sockets']} label="Sockets" />
      <ItemCondition path={[...path, 'item_condition']} />
    </>
  );
};

PlayerSockets.getDefaultConfig = () => {
  return {
    type: 'skilltree:player_sockets',
    sockets: 1,
    item_condition: ItemCondition.getDefaultConfig(),
  };
};
