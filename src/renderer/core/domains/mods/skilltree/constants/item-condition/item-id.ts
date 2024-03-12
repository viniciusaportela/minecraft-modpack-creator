import { itemPicker } from '../fields';

export const ITEM_CONDITION_ITEM_ID = () => ({
  __key: 'skilltree:item_id',
  type: 'skilltree:item_id',
  id: itemPicker(),
});
