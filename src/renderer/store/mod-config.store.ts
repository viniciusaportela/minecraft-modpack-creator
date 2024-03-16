import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IUseModConfigOptions } from '../hooks/use-mod-config';

export function curriedReadByPath(currentState: any) {
  return (path: string[]) => {
    let current = currentState;
    for (let i = 0; i < path.length; i++) {
      if (!current) {
        return undefined;
      }
      current = current[path[i]];
    }
    return current;
  };
}

export function curriedWriteByPath(currentState: any) {
  return (path: string[], value: any) => {
    let current = currentState;
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        current[path[i]] = value;
      } else {
        current = current[path[i]];
      }
    }
  };
}

export function doesPath(path: string[]) {
  return {
    is: (otherPath: string[]) => {
      if (path.length !== otherPath.length) {
        return false;
      }

      for (let i = 0; i < otherPath.length; i++) {
        if (
          path[i] !== otherPath[i] &&
          path[i] !== '*' &&
          otherPath[i] !== '*'
        ) {
          return false;
        }
      }

      return true;
    },
    isChildOf: (otherPath: string[]) => {
      if (path.length < otherPath.length) {
        return false;
      }

      for (let i = 0; i < otherPath.length; i++) {
        if (
          otherPath[i] !== path[i] &&
          otherPath[i] !== '*' &&
          path[i] !== '*'
        ) {
          return false;
        }
      }

      return true;
    },
  };
}

export const useModConfigStore = create(
  immer((immerSet) => ({
    hooks: {},
    updateConfig: (
      sourceId: string,
      path: string[],
      modifierCb: (currentState: any) => any,
    ) => {
      let updatedValue: any;

      immerSet((currentState: any) => {
        const stateInPath = curriedReadByPath(currentState)(path);
        updatedValue = modifierCb(stateInPath);
        curriedWriteByPath(currentState)(path, updatedValue);
      });

      const hook = useModConfigStore.getState().hooks[sourceId];
      if (hook) {
        hook.listeners.forEach((listener) => {
          listener.onChange(updatedValue);
        });
      }

      return updatedValue;
    },
    registerHook: (
      id: string,
      path: string[],
      options: IUseModConfigOptions,
      onChange: (newValue: any) => void,
    ) => {
      immerSet((state) => {
        state.hooks[id] = { path, options, onChange, listeners: [] };

        for (const hookId in state.hooks) {
          const hook = state.hooks[hookId];

          if (hookId === id) {
            continue;
          }

          if (options.listenMeAndChildrenChanges) {
            if (doesPath(hook.path).isChildOf(path)) {
              hook.listeners.push({ hookId: id, onChange });
            }
          }

          if (options.listenChanges) {
            if (doesPath(hook.path).is(path)) {
              hook.listeners.push({ hookId: id, onChange });
            }
          }

          if (options.listenForeignChanges) {
            for (let i = 0; i < options.listenForeignChanges.length; i++) {
              if (
                doesPath(hook.path).isChildOf(options.listenForeignChanges[i])
              ) {
                hook.listeners.push({ hookId: id, onChange });
              }
            }
          }

          if (hook.options.listenMeAndChildrenChanges) {
            if (doesPath(path).isChildOf(hook.path)) {
              state.hooks[id].listeners.push({
                hookId: hook.hookId,
                onChange: hook.onChange,
              });
            }
          }

          if (hook.options.listenChanges) {
            if (doesPath(path).is(hook.path)) {
              state.hooks[id].listeners.push({
                hookId: hook.hookId,
                onChange: hook.onChange,
              });
            }
          }

          if (hook.options.listenForeignChanges) {
            for (let i = 0; i < hook.options.listenForeignChanges.length; i++) {
              if (
                doesPath(path).isChildOf(hook.options.listenForeignChanges[i])
              ) {
                state.hooks[id].listeners.push({
                  hookId: hook.hookId,
                  onChange: hook.onChange,
                });
              }
            }
          }
        }
      });
    },
    unregisterHook: (id: string) => {
      immerSet((state) => {
        for (const hookId in state.hooks) {
          const hook = state.hooks[hookId];
          const listenerIndex = hook.listeners.findIndex(
            (listener) => listener.hookId === id,
          );

          if (listenerIndex !== -1) {
            hook.listeners.splice(listenerIndex, 1);
          }
        }

        delete state.hooks[id];
      });
    },
  })),
);
