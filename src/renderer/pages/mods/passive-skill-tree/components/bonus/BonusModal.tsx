import {
  Button,
  Divider,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Selection,
} from '@nextui-org/react';
import React, { Key, useEffect, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Page, Pager } from '../../../../../components/pager/Pager';
import { useErrorHandler } from '../../../../../core/errors/hooks/useErrorHandler';
import { useModConfig } from '../../../../../hooks/use-mod-config';
import { AllAttributes } from './bonuses/AllAttributes';
import EditBonus from './EditBonus';

interface BonusModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  focusedNodePath: string[];
}

export default function BonusModal({
  isOpen,
  onOpenChange,
  focusedNodePath,
}: BonusModalProps) {
  const handleError = useErrorHandler();
  const [bonuses, setBonuses] = useModConfig(
    [...focusedNodePath, 'data', 'bonuses'],
    {
      listenMeAndChildrenChanges: true,
    },
  );

  useEffect(() => {
    console.log('bonuses changed', bonuses);
  }, [bonuses]);

  const [page, setPage] = useState(bonuses.length ? 'bonus-0' : 'empty');

  const createPages = () => {
    return bonuses.map((bonus, index) => (
      <Page key={index} name={`bonus-${index}`}>
        <EditBonus
          selectedBonusPath={[...focusedNodePath, 'data', 'bonuses', index]}
          onSelectionChange={(keys) => {
            console.log('selection changed', keys);
          }}
        />
      </Page>
    ));
  };

  const addBonus = async () => {
    try {
      const defaultConfig = AllAttributes.getDefaultConfig();
      console.log('defaultConfig', defaultConfig);
      setBonuses((bonuses) => [...bonuses, defaultConfig]);

      if (page === 'empty') {
        setPage('bonus-0');
      }
    } catch (err) {
      await handleError(err);
    }
  };

  const onClickBonus = (key: Selection) => {
    console.log('key', key);
    setPage(Array.from(key as Set<Key>)[0] as string);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
      <ModalContent>
        <ModalHeader className="pb-2 px-3">
          <div className="w-60 mr-4 flex">
            <span>Bonuses</span>
            <Button
              color="primary"
              size="sm"
              className="w-10 ml-auto"
              onPress={addBonus}
            >
              <Plus />
            </Button>
          </div>
          <span className="px-4">Edit Bonus</span>
        </ModalHeader>
        <ModalBody className="px-3">
          <div className="flex min-h-52 gap-8">
            <div className="flex flex-col w-60">
              {bonuses.length > 0 ? (
                <ScrollShadow>
                  <Listbox
                    onSelectionChange={onClickBonus}
                    disallowEmptySelection
                    itemClasses={{
                      base: 'data-[selected=true]:bg-zinc-700',
                    }}
                    classNames={{
                      base: 'p-0',
                    }}
                    selectionMode="single"
                    selectedKeys={[page]}
                    hideSelectedIcon
                  >
                    {bonuses.map((bonus, index) => (
                      <ListboxItem key={`bonus-${index}`}>
                        {bonus.type}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </ScrollShadow>
              ) : (
                <div className="flex-1 items-center justify-center">
                  <span className="italic">No bonuses added</span>
                </div>
              )}
            </div>
            <Divider
              orientation="vertical"
              className="absolute top-0 bottom-0 left-[268px]"
            />
            <div className="flex flex-col flex-1 w-0">
              <Pager page={page} initialPage={page} onPageChange={setPage}>
                <Page name="empty" />
                {createPages()}
              </Pager>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
