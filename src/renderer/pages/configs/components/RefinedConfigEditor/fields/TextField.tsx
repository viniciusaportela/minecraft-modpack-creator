import { Input } from '@nextui-org/react';
import { memo } from 'react';
import CommentTooltip from './CommentTooltip';
import capitalize from '../../../../../helpers/capitalize';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';

interface TextFieldProps {
  path: string[];
}

const TextField = memo(({ path }: TextFieldProps) => {
  console.log('render TextField', path);
  const config = useRefinedConfig(
    (st) => curriedReadByPath(st.fields)(path),
    true,
  );
  const write = useRefinedConfig((st) => st.write);

  return (
    <div className="mt-4 flex flex-col">
      <span>
        {capitalize(config.name ?? '')}{' '}
        {config.comment && <CommentTooltip comment={config.comment} />}
      </span>
      <Input
        value={config.value}
        onValueChange={(txt) => write(path, txt)}
        type={config.type === 'number' ? 'number' : 'text'}
      />
    </div>
  );
});

export default TextField;
