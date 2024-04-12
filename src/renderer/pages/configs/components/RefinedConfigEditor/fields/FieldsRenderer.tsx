import { memo } from 'react';
import TextField from './TextField';
import SwitchField from './SwitchField';
import { useRefinedConfig } from '../../../../../core/domains/minecraft/config/RefinedConfigContext';
import GroupTitle from './GroupTitle';
import { curriedReadByPath } from '../../../../../helpers/read-write-by-path';
import { RefinedField } from '../../../../../core/domains/minecraft/config/interfaces/parser';
import ListField from './ListField';

interface FieldsRendererProps {
  path: string[];
  onUpdatedRefined?: () => void;
}

export const FieldsRenderer = memo(
  ({ path, onUpdatedRefined }: FieldsRendererProps) => {
    const pathsAndTypes: {
      path: string[];
      type: RefinedField['type'];
      line: number;
      array?: boolean;
    }[] = useRefinedConfig(
      (state) =>
        curriedReadByPath(state.fields)(path)?.map(
          (field: RefinedField, index: number) => {
            return {
              path: [...path, String(index)],
              type: field.type,
              line: field.lineNumber,
              array: field.array,
            };
          },
        ),
      true,
    );

    return pathsAndTypes?.map((pathAndType) => {
      if (pathAndType.array) {
        return (
          <ListField
            path={pathAndType.path}
            key={pathAndType.line}
            onUpdatedRefined={onUpdatedRefined}
          />
        );
      }

      if (['string', 'number'].includes(pathAndType.type)) {
        return (
          <TextField
            path={pathAndType.path}
            key={pathAndType.line}
            onUpdatedRefined={onUpdatedRefined}
          />
        );
      }

      if (pathAndType.type === 'boolean') {
        return (
          <SwitchField
            path={pathAndType.path}
            key={pathAndType.line}
            onUpdatedRefined={onUpdatedRefined}
          />
        );
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
              onUpdatedRefined={onUpdatedRefined}
            />
          </div>
        );
      }

      return null;
    });
  },
);
