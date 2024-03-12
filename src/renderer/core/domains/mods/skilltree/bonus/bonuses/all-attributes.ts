import { FieldsField } from './fields-field';
import { NumberField } from '../fields/base/number-field';
import { AttributeField } from '../fields/attribute-field';
import { FieldBase } from '../fields/base/field-base';

export class AllAttributes extends FieldsField {
  getSchema(): Record<string, typeof FieldBase> {
    return {
      amount: NumberField,
      operation: AttributeField,
      // TODO player_condition: PlayerConditionField,
      // TODO player_multiplier
    };
  }

  getTypeValue() {
    return 'skilltree:all_attributes';
  }

  getReadableName() {
    return 'All Attributes';
  }
}
