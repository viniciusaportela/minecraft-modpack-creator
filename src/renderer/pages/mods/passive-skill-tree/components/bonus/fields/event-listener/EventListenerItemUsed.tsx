import { FunctionWithDefaultConfig } from '../../../../interfaces/function-with-default-config';
import { PlayerCondition } from '../player-condition/PlayerCondition';
import { PlayerMultiplier } from '../player-multiplier/PlayerMultiplier';
import ChoiceField from '../ChoiceField';
import { ItemCondition } from '../item-condition/ItemCondition';

export const EventListenerItemUsed: FunctionWithDefaultConfig = ({ path }) => {
  return (
    <>
      <PlayerCondition path={[...path, 'player_condition']} />
      <PlayerMultiplier path={[...path, 'player_multiplier']} />
      <ItemCondition path={[...path, 'item_condition']} />
    </>
  );
};

EventListenerItemUsed.getDefaultConfig = () => {
  return {
    type: 'skilltree:item_used',
    player_condition: PlayerCondition.getDefaultConfig(),
    player_multiplier: PlayerMultiplier.getDefaultConfig(),
    item_condition: PlayerCondition.getDefaultConfig(),
  };
};
