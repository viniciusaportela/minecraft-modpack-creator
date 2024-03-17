import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
  Selection,
} from '@nextui-org/react';
import { useModConfig } from '../../../../../hooks/use-mod-config';
import {
  ALL_BONUSES,
  COMPONENTS_BY_BONUS,
  EBonus,
  ReadableByBonus,
} from '../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';

interface BonusPageProps {
  onSelectionChange: (keys: Selection) => void;
  selectedBonusPath: string[];
}

export default function EditBonus({
  selectedBonusPath,
  onSelectionChange,
}: BonusPageProps) {
  const [bonus] = useModConfig(selectedBonusPath, {
    listenChanges: true,
  });

  return (
    <ScrollShadow className="flex flex-col no-scrollbar">
      <Dropdown size="lg">
        <DropdownTrigger>
          <Button variant="bordered" className="min-h-[42px]">
            {bonus.type}
          </Button>
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
      {COMPONENTS_BY_BONUS[bonus.type as EBonus]({
        path: selectedBonusPath,
      })}
    </ScrollShadow>
  );
}
