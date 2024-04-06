import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { WarningCircle } from '@phosphor-icons/react';
import { BusinessError } from '../../core/errors/business-error.enum';
import BusinessLogicError from '../../core/errors/business-logic-error';
import capitalize from '../../helpers/capitalize';

interface BuildErrorModalProps {
  isOpen: boolean;
  onOpenChange: () => any;
  error: Error | BusinessLogicError | null;
}

export default function BuildErrorReport({
  isOpen,
  onOpenChange,
  error,
}: BuildErrorModalProps) {
  const getMod = () => {
    console.log('getMod', JSON.stringify(error));
    if (!error) {
      return '';
    }

    if (error instanceof BusinessLogicError) {
      return error.meta?.mod?.modId || '';
    }
  };

  const getDescriptiveError = () => {
    if (error instanceof BusinessLogicError) {
      if (error.code === BusinessError.BuildError) {
        return error.meta.descriptiveError;
      }
    }

    return '';
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-2">
            <WarningCircle className="text-danger" size={24} />
            Build Failure Report
          </div>
        </ModalHeader>
        <ModalBody>
          {getMod() && (
            <span className="text-danger">
              The following mod failed to build: <b>{capitalize(getMod())}</b>
            </span>
          )}

          {getDescriptiveError() && (
            <>
              <span className="font-bold text-lg">Descriptive Error:</span>
              {getDescriptiveError()}
            </>
          )}

          <span className="font-bold text-lg">Full Error:</span>
          <div className="overflow-x-auto mb-4">{error?.message}</div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
