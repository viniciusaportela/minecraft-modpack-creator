import { ComponentChoiceField } from './base/component-choice-field';
import { AttributeField } from './attribute-field';
import { NumberField } from './base/number-field';

export class PlayerConditionField extends ComponentChoiceField<
  | 'skiltree:none'
  | 'skilltree:attribute_value'
  | 'skilltree:burning'
  | 'skilltree:dual_wielding'
  | 'skilltree:effect_amount'
  | 'skilltree:fishing'
  | 'skilltree:food_level'
  | 'skilltree:has_effect'
  | 'skilltree:has_gems'
  | 'skilltree:has_item_equipped'
  | 'skilltree:has_item_in_hand'
  | 'skilltree:health_percentage'
  | 'skilltree:underwater'
> {
  getOptions() {
    return [
      {
        key: 'skiltree:none',
        label: 'None',
        value: {
          type: 'skiltree:none',
        },
      },
      {
        key: 'skilltree:attribute_value',
        label: 'Attribute Value',
        value: {
          type: 'skilltree:attribute_value',
          attribute: AttributeField,
          min: NumberField.withParams({ defaultValue: 5 }),
          max: NumberField.withParams({ isOptional: true, defaultValue: -1 }),
        },
      },
      {
        key: 'skilltree:burning',
        label: 'Burning',
        value: {
          type: 'skilltree:burning',
        },
      },
      {
        key: 'skilltree:dual_wielding',
        label: 'Dual Wielding',
        value: {
          type: 'skilltree:dual_wielding',
          // TODO item_condition: ItemConditionField,
        },
      },
    ];
  }
}
