import { tagPicker } from '../fields';

export const ITEM_CONDITION_TAG = () => ({
  __key: 'skilltree:tag',
  type: 'skilltree:tag',
  tag_id: tagPicker(),
});
