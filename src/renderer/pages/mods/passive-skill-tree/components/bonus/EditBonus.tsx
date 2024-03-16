import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from '@nextui-org/react';
import { useModConfig } from '../../../../../hooks/use-mod-config';
import {
  ALL_BONUSES,
  EBonus,
  ReadableByBonus,
} from '../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { AllAttributes } from './bonuses/AllAttributes';

interface BonusPageProps {
  onSelectionChange: (keys: Selection) => void;
  selectedBonusPath: string[];
}

export default function EditBonus({
  selectedBonusPath,
  onSelectionChange,
}: BonusPageProps) {
  const [bonus, setBonus] = useModConfig(selectedBonusPath, {
    listenMeAndChildrenChanges: true,
  });

  const PAGE_BY_BONUS = {
    [EBonus.AllAttributes]: AllAttributes,
  };

  console.log(bonus, ALL_BONUSES);

  return (
    <>
      <Dropdown size="lg">
        <DropdownTrigger>
          <Button variant="bordered">{bonus.type}</Button>
        </DropdownTrigger>
        <DropdownMenu
          items={ALL_BONUSES.map((bonus) => ({ key: bonus, label: bonus }))}
          selectedKeys={[bonus.type]}
          onSelectionChange={onSelectionChange}
        >
          {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
      <span className="font-bold mt-3 mb-2">
        {ReadableByBonus[bonus.type as EBonus] ?? bonus.type}
      </span>
      {PAGE_BY_BONUS[bonus.type as EBonus]({ bonusPath: selectedBonusPath })}
    </>
  );
}
