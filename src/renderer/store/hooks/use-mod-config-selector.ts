import { useContext } from 'react';
import { useStore } from 'zustand';
import { StoreApi } from 'zustand/vanilla';
import get from 'lodash.get';
import set from 'lodash.set';
import { ModConfigContext } from '../context/mod-config-context';

export function useModConfigSelector<T = any>(
  selector: string[],
): [T, (newValue: T) => void] {
  const storeInContext = useContext(ModConfigContext);

  if (!storeInContext) {
    throw new Error('useModConfigCtx must be used within a ModIdProvider');
  }

  return [
    useStore(storeInContext as StoreApi<T>, (st) => get(st, selector)),
    (newValue: T) => {
      storeInContext.setState((state: any) => {
        set(state, selector, newValue);
      });
    },
  ];
}
