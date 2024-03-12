import { FieldsField } from '../../../../../core/domains/mods/skilltree/bonus/bonuses/fields-field';
import { FieldBase } from '../../../../../core/domains/mods/skilltree/bonus/fields/base/field-base';
import { NumberField } from '../../../../../core/domains/mods/skilltree/bonus/fields/base/number-field';
import { ChoiceField } from '../../../../../core/domains/mods/skilltree/bonus/fields/base/choice-field';
import Number from './fields/Number';
import Choice from './fields/Choice';

interface BonusRendererProps {
  fields: FieldsField;
}

export default function FieldsRenderer({ fields }: BonusRendererProps) {
  function getComponentByField(key: string, field: FieldBase) {
    switch (field.getType()) {
      case 'number':
        return <Number field={field as NumberField} key={key} />;
      case 'choice':
        return <Choice field={field as ChoiceField<string>} key={key} />;
      default:
        return <div />;
    }
  }

  return (
    <div>
      {fields.map((key, field) => {
        return getComponentByField(key, field);
      })}
    </div>
  );
}
