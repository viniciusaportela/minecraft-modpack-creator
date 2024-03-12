import { itemCondition } from './item-condition';

export const ITEM_CONDITION_ENCHANTED = () => ({
  __key: 'skilltree:enchanted',
  type: 'skilltree:enchanted',
  item_condition: itemCondition(),
});
