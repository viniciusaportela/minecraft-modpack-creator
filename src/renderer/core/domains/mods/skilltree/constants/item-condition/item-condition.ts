import { componentChoice, subcomponent } from '../fields';
import { ITEM_CONDITION_EQUIPMENT_TYPE } from './equipment-type';
import { ITEM_CONDITION_ENCHANTED } from './enchanted';
import { ITEM_CONDITION_FOOD } from './food';
import { ITEM_CONDITION_ITEM_ID } from './item-id';
import { ITEM_CONDITION_NONE } from './none';
import { ITEM_CONDITION_POTION } from './potion';
import { ITEM_CONDITION_TAG } from './tag';

export const ITEM_CONDITION = () =>
  componentChoice('skilltree:none', [
    ITEM_CONDITION_EQUIPMENT_TYPE(),
    ITEM_CONDITION_ENCHANTED(),
    ITEM_CONDITION_FOOD(),
    ITEM_CONDITION_ITEM_ID(),
    ITEM_CONDITION_NONE(),
    ITEM_CONDITION_POTION(),
    ITEM_CONDITION_TAG(),
  ]);

export const itemCondition = () => {
  return subcomponent(ITEM_CONDITION);
};
