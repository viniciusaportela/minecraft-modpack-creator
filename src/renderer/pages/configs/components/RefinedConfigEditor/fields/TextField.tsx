import { Input } from '@nextui-org/react';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';
import CommentTooltip from './CommentTooltip';
import capitalize from '../../../../../helpers/capitalize';

interface TextFieldProps {
  field: RefinedField;
}

export default function TextField({ field }: TextFieldProps) {
  return (
    <div className="mt-4 flex flex-col">
      <span>
        {capitalize(field.name ?? '')}{' '}
        {field.comment && <CommentTooltip field={field} />}
      </span>
      <Input
        value={field.value}
        type={field.type === 'number' ? 'number' : 'text'}
      />
    </div>
  );
}
