import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import capitalize from '../../../../../helpers/capitalize';
import CommentTooltip from './CommentTooltip';

interface GroupTitleProps {
  path: string[];
}

export default function GroupTitle({ path }: GroupTitleProps) {
  const title = useRefinedConfig(
    (state) => curriedReadByPath(state.fields)(path)?.name,
  );
  const comment = useRefinedConfig(
    (state) => curriedReadByPath(state.fields)(path)?.comment,
  );

  return (
    <span className="text-lg font-bold">
      {capitalize(title)} {comment && <CommentTooltip comment={comment} />}
    </span>
  );
}
