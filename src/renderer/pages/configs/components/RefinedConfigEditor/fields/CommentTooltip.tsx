import { Tooltip } from '@nextui-org/react';
import { QuestionMark } from '@phosphor-icons/react';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';

interface CommentProps {
  field: RefinedField;
}

export default function CommentTooltip({ field }: CommentProps) {
  return (
    <Tooltip
      content={field.comment!.split('\n').map((line) => (
        <span>{line}</span>
      ))}
    >
      <span className="rounded-full bg-zinc-600 h-4 w-4 ml-1 inline-flex items-center justify-center">
        <QuestionMark className="inline" size={12} />
      </span>
    </Tooltip>
  );
}
