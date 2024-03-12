import { Node } from 'reactflow';
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
import React, { Key, useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Page, Pager } from '../../../../../components/pager/Pager';
import { EBonus } from '../../../../../core/domains/mods/skilltree/enums/skill-bonus.enum';
import { createFieldsOfType } from '../../../../../core/domains/mods/skilltree/bonus/create-fields';
import { useErrorHandler } from '../../../../../core/errors/hooks/useErrorHandler';
import BonusPage from './BonusPage';

interface BonusModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  focusedNode: Node | null;
  setFocusedNode: (updateFn: (prev: Node) => Node) => void;
}

export default function BonusModal({
  isOpen,
  onOpenChange,
  focusedNode,
  setFocusedNode,
}: BonusModalProps) {
  const handleError = useErrorHandler();
  // const bonuses = useBonuses(focusedNode);
  const bonuses = [];
  const [page, setPage] = useState(bonuses.length ? 'bonus-0' : 'empty');

  const createBonusList = () => {
    return bonuses.map((bonus, index) => (
      <ListboxItem key={`bonus-${index}`}>
        {bonus.getReadableName()}
      </ListboxItem>
    ));
  };

  const createPages = () => {
    return bonuses.map((bonus, index) => (
      <Page key={index} name={`bonus-${index}`}>
        <BonusPage
          selectedBonus={bonus.getTypeValue()}
          onSelectionChange={() => {
            console.log('selection changed');
          }}
          fields={bonus}
        />
      </Page>
    ));
  };

  const addBonus = async () => {
    try {
      setFocusedNode((prev) => {
        if (!prev?.data?.bonuses) {
          prev.data.bonuses = [];
        }

        prev.data.bonuses.push(
          createFieldsOfType(EBonus.AllAttributes).build(),
        );

        return prev;
      });
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
        <ModalHeader className="pb-2">
          <div className="w-60 mr-4 flex">
            <span>Bonuses</span>
            <Button
              color="primary"
              size="sm"
              className="w-10 ml-auto mr-2"
              onPress={addBonus}
            >
              <Plus />
            </Button>
          </div>
          <span className="px-4">Edit Bonus</span>
        </ModalHeader>
        <ModalBody className="px-3">
          <div className="flex h-52">
            <div className="flex flex-col w-60">
              {bonuses.length > 0 ? (
                <ScrollShadow>
                  <Listbox
                    onSelectionChange={onClickBonus}
                    selectionMode="single"
                    selectedKeys={page}
                  >
                    {createBonusList()}
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
              className="mt-[-72px] h-[calc(100%+80px)] mx-4"
            />
            <div className="flex flex-col flex-1 w-0 px-2">
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
