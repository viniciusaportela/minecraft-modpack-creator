import { itemCondition } from '../item-condition/item-condition';

export const PLAYER_CONDITION_DUAL_WIELDING = () => ({
  __key: 'skilltree:dual_wielding',
  type: 'skilltree:dual_wielding',
  item_condition: itemCondition(),
});
