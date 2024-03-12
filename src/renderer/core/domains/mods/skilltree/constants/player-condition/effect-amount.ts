import { number, removeMinusOne } from '../fields';

export const PLAYER_CONDITION_EFFECT_AMOUNT = () => ({
  __key: 'skilltree:effect_amount',
  type: 'skilltree:effect_amount',
  min: number(1),
  max: removeMinusOne(number(-1)),
});
