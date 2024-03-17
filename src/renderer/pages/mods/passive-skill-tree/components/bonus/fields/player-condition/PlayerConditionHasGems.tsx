import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import NumberField from '../NumberField';
import { ItemCondition } from '../item-condition/ItemCondition';
import { PlayerMultiplier } from '../player-multiplier/PlayerMultiplier';

export const PlayerConditionHasGems: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <NumberField path={[...path, 'min']} label="Min" />
      <NumberField path={[...path, 'max']} label="Max" />
      <ItemCondition path={[...path, 'item_condition']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
    </>
  );
};

PlayerConditionHasGems.getDefaultConfig = () => {
  return {
    type: 'skilltree:has_gems',
    min: 1,
    max: undefined,
    item_condition: ItemCondition.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
  };
};
