import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import {
  curriedReadByPath,
  useModConfigStore,
} from '../store/mod-config.store';
import { useModConfigCtx } from '../store/mod-config.context';

export interface IUseModConfigOptions {
  listenChanges?: boolean;
  listenMeAndChildrenChanges?: boolean;
  listenForeignChanges?: string[][];
}

export function useModConfig<T = any>(
  path: string[],
  options: IUseModConfigOptions = {},
): [T, (modifierCb: (currentState: any) => T) => void] {
  const hookId = useId();
  const updateConfig = useModConfigStore((st) => st.updateConfig);
  const registerHook = useModConfigStore((st) => st.registerHook);
  const unregisterHook = useModConfigStore((st) => st.unregisterHook);
  const modConfig = useModConfigCtx();

  const modId = modConfig.mod.toString();

  const initialConfig = useMemo(() => {
    const completePath = [modId, ...path];
    return curriedReadByPath(useModConfigStore.getState())(completePath);
  }, []);

  const [internalState, setInternalState] = useState(initialConfig);

  useEffect(() => {
    const completePath = [modId, ...path];
    registerHook(
      hookId,
      completePath,
      {
        ...options,
        listenForeignChanges: options.listenForeignChanges?.map((path) => [
          modId,
          ...path,
        ]),
      },
      () => {
        setInternalState(
          curriedReadByPath(useModConfigStore.getState())(completePath),
        );
      },
    );

    return () => {
      unregisterHook(hookId);
    };
  }, []);

  const saveToRealmDebounce = useMemo(() => {
    return debounce(() => {
      console.log('run inside debounce');
      modConfig.writeConfig(useModConfigStore.getState()[modId]);
    }, 1000);
  }, []);

  const updateState = useCallback(
    (modifierCb: (currentState: any) => any, skipRealm?: boolean) => {
      const completePath = [modId, ...path];

      // DEV also consider the listenForForeign (to listen only specific children: listenForForeign: ['tree.nodes.*.data.backgroundIcon'])
      const updatedValue = updateConfig(hookId, completePath, modifierCb);

      setInternalState(updatedValue);

      if (!skipRealm) {
        saveToRealmDebounce();
      }
    },
    [],
  );

  return [internalState, updateState];
}

// DEV fn to only update data, not listen
export function useWriteConfig() {
  const modConfig = useModConfigCtx();
  const updateConfig = useModConfigStore((st) => st.updateConfig);

  return (config: any) => {
    writeConfig(modConfig.mod.toString(), config);
  };
}
