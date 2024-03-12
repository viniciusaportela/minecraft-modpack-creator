import { DropdownItem, DropdownMenu, Selection } from '@nextui-org/react';
import FieldsRenderer from './FieldsRenderer';
import { FieldsField } from '../../../../../core/domains/mods/skilltree/bonus/bonuses/fields-field';
import { FieldBase } from '../../../../../core/domains/mods/skilltree/bonus/fields/base/field-base';

interface BonusPageProps {
  selectedBonus: string;
  onSelectionChange: (keys: Selection) => void;
  fields: FieldsField;
}

export default function BonusPage({
  selectedBonus,
  fields,
  onSelectionChange,
}: BonusPageProps) {
  return (
    <>
      {/* <DropdownMenu */}
      {/*   items={fields.map((key, field) => [key, field] as [string, FieldBase])} */}
      {/*   selectedKeys={[selectedBonus]} */}
      {/*   onSelectionChange={onSelectionChange} */}
      {/* > */}
      {/*   {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>} */}
      {/* </DropdownMenu> */}
      <FieldsRenderer fields={fields} />
    </>
  );
}
