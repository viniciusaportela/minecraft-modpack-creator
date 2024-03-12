import { Node } from 'reactflow';
import { useEffect, useMemo, useState } from 'react';
import { FieldsField } from '../bonuses/fields-field';
import { createFieldsWithConfig } from '../create-fields';

export function useBonuses(node: Node | null): FieldsField[] {
  const bonuses = useMemo(() => {
    if (!node?.data?.bonuses) {
      return [];
    }

    return node.data.bonuses.map((bonus: any) => createFieldsWithConfig(bonus));
  }, [node]);

  const [fields, setFields] = useState(bonuses);

  useEffect(() => {
    setFields(bonuses);
  }, [node]);

  return fields;
}
