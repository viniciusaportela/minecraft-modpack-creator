import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { FC, useState } from 'react';

const MINECRAFT_VERSIONS = [
  '1.20.4',
  '1.20.3',
  '1.20.2',
  '1.20.1',
  '1.20.0',
  '1.19.4',
  '1.19.3',
  '1.19.2',
  '1.19.1',
  '1.19.0',
  '1.18.2',
  '1.18.1',
  '1.18.0',
  '1.17.1',
  '1.17.0',
  '1.16.5',
  '1.16.4',
  '1.16.3',
  '1.16.2',
  '1.16.1',
  '1.16.0',
  '1.15.2',
  '1.15.1',
  '1.15.0',
  '1.14.4',
  '1.14.3',
  '1.14.2',
  '1.14.1',
  '1.14.0',
  '1.13.2',
  '1.13.1',
  '1.13.0',
  '1.12.2',
  '1.12.1',
  '1.12.0',
  '1.11.2',
  '1.11.1',
  '1.11.0',
  '1.10.2',
  '1.10.1',
  '1.10.0',
  '1.9.4',
  '1.9.3',
  '1.9.2',
  '1.9.1',
  '1.9.0',
  '1.8.9',
  '1.8.8',
  '1.8.7',
  '1.8.6',
  '1.8.5',
  '1.8.4',
  '1.8.3',
  '1.8.2',
  '1.8.1',
  '1.8.0',
  '1.7.10',
  '1.7.9',
  '1.7.8',
  '1.7.7',
  '1.7.6',
  '1.7.5',
  '1.7.4',
  '1.7.2',
  '1.6.4',
  '1.6.2',
  '1.6.1',
  '1.5.2',
  '1.5.1',
  '1.5.0',
];

interface MinecraftVersionPickerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPickVersion: (version: string) => void;
}

export const MinecraftVersionPickerModal: FC<
  MinecraftVersionPickerModalProps
> = ({ isOpen, onOpenChange, onPickVersion }) => {
  const [value, setValue] = useState(MINECRAFT_VERSIONS[0]);

  console.log('MinecraftVersionPicker', value);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        <ModalHeader className="pb-0">
          Confirm the Minecraft Version
        </ModalHeader>
        <ModalBody className="pb-4">
          <span className="text-sm">
            Since many versions of Minecraft can be used, you must select the
            version that mods are targeting.
          </span>
          <Autocomplete
            size="sm"
            allowsCustomValue
            value={value}
            onInputChange={(v) => setValue(v)}
            label="Minecraft Version"
            onKeyDown={(e: any) => e.continuePropagation()}
          >
            {MINECRAFT_VERSIONS.map((version) => (
              <AutocompleteItem key={version} value={version}>
                {version}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Button
            className="ml-auto"
            color="primary"
            onPress={() => onPickVersion(value)}
          >
            Confirm
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
