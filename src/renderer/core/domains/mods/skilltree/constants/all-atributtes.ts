import { choice } from './fields';
import { playerCondition } from './player-condition/player-condition';

export const ALL_ATTRIBUTES = () => ({
  type: 'skilltree:all_attributes',
  operation: choice(0, [
    { key: 'Addition', value: 0 },
    { key: 'Multiply Base', value: 1 },
    { key: 'Multiply Total', value: 2 },
  ]),
  player_condition: playerCondition(),
});
