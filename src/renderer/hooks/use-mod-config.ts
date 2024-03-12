import { useShallow } from 'zustand/react/shallow';
import { useCallback } from 'react';
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
