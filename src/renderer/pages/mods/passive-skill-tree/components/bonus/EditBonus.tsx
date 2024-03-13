import { Selection } from '@nextui-org/react';

interface BonusPageProps {
  selectedBonus: string;
  onSelectionChange: (keys: Selection) => void;
}

export default function EditBonus({
  selectedBonus,
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
    </>
  );
}
