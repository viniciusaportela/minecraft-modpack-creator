import { choice, number, removeMinusOne } from '../fields';

export const PLAYER_CONDITION_ATTRIBUTE_VALUE = () => ({
  __key: 'skilltree:attribute_value',
  type: 'skilltree:attribute_value',
  // TODO calculate choices from realm
  attribute: choice('minecraft:generic.armor', []),
  min: number(5),
  max: removeMinusOne(number(-1)),
});
