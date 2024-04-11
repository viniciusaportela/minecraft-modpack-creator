import { memo, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { shallow } from 'zustand/shallow';
import TextField from './TextField';
import SwitchField from './SwitchField';
import {
  RefinedConfigContext,
  useRefinedConfig,
} from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import GroupTitle from './GroupTitle';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';

interface FieldsRendererProps {
  path: string[];
}

export const FieldsRenderer = memo(({ path }: FieldsRendererProps) => {
  const pathsAndTypes: {
    path: string[];
    type: RefinedField['type'];
    line: number;
  }[] = useRefinedConfig(
    (state) =>
      curriedReadByPath(state.fields)(path)?.map(
        (field: RefinedField, index: number) => {
          return {
            path: [...path, String(index)],
            type: field.type,
            line: field.lineNumber,
          };
        },
      ),
    true,
  );

  return pathsAndTypes?.map((pathAndType) => {
    if (['string', 'number'].includes(pathAndType.type)) {
      return <TextField path={pathAndType.path} key={pathAndType.line} />;
    }

    if (pathAndType.type === 'boolean') {
      return <SwitchField path={pathAndType.path} key={pathAndType.line} />;
    }

    if (pathAndType.type === 'group') {
      return (
        <div
          className="rounded-md border-1 mt-4 border-solid border-zinc-600 p-2"
          key={pathAndType.line}
        >
          <GroupTitle path={pathAndType.path} />
          <FieldsRenderer
            path={[...pathAndType.path, 'children']}
            key={pathAndType.line}
          />
        </div>
      );
    }

    return null;
  });
});
