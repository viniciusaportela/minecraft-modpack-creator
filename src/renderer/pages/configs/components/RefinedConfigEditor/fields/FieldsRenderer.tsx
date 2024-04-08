import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';
import TextField from './TextField';
import SwitchField from './SwitchField';
import CommentTooltip from './CommentTooltip';
import capitalize from '../../../../../helpers/capitalize';

interface FieldsRendererProps {
  fields: RefinedField[];
  isRoot?: boolean;
}

export function FieldsRenderer({ fields }: FieldsRendererProps) {
  return fields
    ?.filter((field) => !['unknown', 'aggr-comment'].includes(field.type))
    .map((field) => {
      if (['string', 'number'].includes(field.type)) {
        return <TextField field={field} />;
      }

      if (field.type === 'boolean') {
        return <SwitchField field={field} />;
      }

      if (field.type === 'group') {
        return (
          <div className="rounded-md border-1 mt-4 border-solid border-zinc-600 p-2">
            <span className="text-lg font-bold">
              {capitalize(field.name)}{' '}
              {field.comment && <CommentTooltip field={field} />}
            </span>
            <FieldsRenderer fields={field.children!} />
          </div>
        );
      }

      return null;
    });
}
