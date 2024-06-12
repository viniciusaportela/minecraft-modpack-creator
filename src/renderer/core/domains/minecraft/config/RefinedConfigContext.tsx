import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createStore, useStore } from 'zustand';
import type { StoreApi } from 'zustand/vanilla';
import debounce from 'lodash.debounce';
import { immer } from 'zustand/middleware/immer';
import { RefinedConfigContextInterface } from './interfaces/refined-config-context';
import { RefinedField } from './interfaces/parser';
import { curriedReadByPath } from '../../../../helpers/read-write-by-path';
import writeLine from '../../../../helpers/write-line';
import { ConfigNode } from './ConfigNode';

export const RefinedConfigContext =
  createContext<StoreApi<RefinedConfigContextInterface> | null>(null);

interface StoreProviderProps extends PropsWithChildren {
  root: ConfigNode;
  fields: RefinedField[];
}

export function stringifiedShallow<S, U>(
  selector: (state: S) => U,
): (state: S) => U {
  const prev = useRef<U>();

  return (state) => {
    const next = selector(state);
    return JSON.stringify(next) === JSON.stringify(prev.current)
      ? (prev.current as U)
      : (prev.current = next);
  };
}

export const RefinedConfigProvider: FC<StoreProviderProps> = ({
  children,
  root,
  fields,
}) => {
  const createStoreForState = () => {
    const debouncedWriteOnDisk = debounce(
      async (field: RefinedField, value: any, callback?: () => void) => {
        const isArray = field.array;

        const stringifiedValue =
          field.type === 'string' && !isArray ? `"${value}"` : value;
        const lineContent = `${'\t'.repeat(field.indentation)}"${field.name}" = ${stringifiedValue}`;

        await writeLine(root.getPath(), field.lineNumber, lineContent);
        callback?.();
      },
      500,
    );

    return createStore(
      immer<RefinedConfigContextInterface>((set, get) => ({
        set,
        fields,
        write: async (path: string[], value: any, callback?: () => void) => {
          set((state) => {
            const field = curriedReadByPath(state.fields)(path);
            field.value = value;
          });

          const field = curriedReadByPath(get().fields)(path);
          if (field.type !== 'group') {
            await debouncedWriteOnDisk(field, value, callback);
          }
        },
      })),
    );
  };

  const [store, setStore] = useState(createStoreForState());

  useEffect(() => {
    setStore(createStoreForState());
  }, [fields]);

  return (
    <RefinedConfigContext.Provider value={store}>
      {children}
    </RefinedConfigContext.Provider>
  );
};

export const useRefinedConfig = <T,>(
  selector: (state: RefinedConfigContextInterface) => T,
  shallow?: boolean,
): T => {
  const store = useContext(RefinedConfigContext)!;

  if (!store) {
    throw new Error('useContextInStore must be used within a StoreProvider');
  }

  return useStore(store, shallow ? stringifiedShallow(selector) : selector);
};
