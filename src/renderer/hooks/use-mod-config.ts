import { useShallow } from 'zustand/react/shallow';
import { useCallback } from 'react';
import set from 'lodash.set';
import get from 'lodash.get';
import { useModConfigStore } from '../store/mod-config.store';
import { useModConfigCtx } from '../store/mod-config.context';

export function useModConfig(selector: (state: unknown) => any) {
  const modConfig = useModConfigCtx();

  const setConfigWithModConfig = useCallback(
    (modifierCb: (oldState: any) => any, skipRealmWrite?: boolean) => {
      useModConfigStore
        .getState()
        .setConfig(modConfig, modifierCb, skipRealmWrite);
    },
    [modConfig],
  );

  return [
    useModConfigStore(
      useShallow((st) => {
        return selector(st[modConfig.mod.toString()]);
      }),
    ),
    setConfigWithModConfig,
  ] as const;
}

export function useModConfigByPath(path: string) {
  const [st, setState] = useModConfig((st) => get(st, path));

  const setStateMemoized = useCallback(
    (newState: unknown) => {
      setState((oldState: any) => {
        return set(oldState, path, newState);
      });
    },
    [st, path],
  );

  return [st, setStateMemoized];
}
