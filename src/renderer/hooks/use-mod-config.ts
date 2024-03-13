import { useShallow } from 'zustand/react/shallow';
import { useCallback, useMemo } from 'react';
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
    [],
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

  const stMemoized = useMemo(() => st, [st]);
  const setStateMemoized = useCallback(() => {
    setState((oldState: any) => {
      return set(oldState, path, stMemoized);
    });
  }, []);

  return [stMemoized, setStateMemoized];
}
