import { number, removeMinusOne } from '../fields';

export const ITEM_CONDITION_FOOD_LEVEL = () => ({
  __key: 'skilltree:food_level',
  type: 'skilltree:food_level',
  min: number(15),
  max: removeMinusOne(number(-1)),
});
