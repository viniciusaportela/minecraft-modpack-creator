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

function addListenerTo(
  listener: { onChange: (...args: any[]) => void; hookId: string },
  obj: any,
) {
  const alreadyHasListener = obj.listeners.find(
    (l) => l.hookId === listener.hookId,
  );

  if (alreadyHasListener) {
    return;
  }

  obj.listeners.push(listener);
}

export const useModConfigStore = create(
  immer((immerSet) => ({
    hooks: {},
    updateConfig: (
      sourceId: string,
      path: string[],
      modifierCb: (currentState: any) => any,
    ) => {
      immerSet((currentState: any) => {
        const stateInPath = curriedReadByPath(currentState)(path);
        const modified = modifierCb(stateInPath);
        curriedWriteByPath(currentState)(path, modified);
      });

      const updatedStateInPath = curriedReadByPath(
        useModConfigStore.getState(),
      )(path);

      const hook = useModConfigStore.getState().hooks[sourceId];
      if (hook) {
        hook.listeners.forEach((listener) => {
          listener.onChange(updatedStateInPath);
        });
      }

      return updatedStateInPath;
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

          if (options.listenMeAndExternalChanges) {
            if (doesPath(hook.path).isChildOf(path)) {
              addListenerTo({ hookId: id, onChange }, hook);
            }

            if (doesPath(path).isChildOf(hook.path)) {
              addListenerTo({ hookId: id, onChange }, hook);
            }
          }

          if (options.listenChanges) {
            if (doesPath(hook.path).is(path)) {
              addListenerTo({ hookId: id, onChange }, hook);
            }
          }

          if (options.listenForeignChanges) {
            for (let i = 0; i < options.listenForeignChanges.length; i++) {
              if (
                doesPath(hook.path).isChildOf(options.listenForeignChanges[i])
              ) {
                addListenerTo({ hookId: id, onChange }, hook);
              }

              if (
                doesPath(options.listenForeignChanges[i]).isChildOf(hook.path)
              ) {
                addListenerTo({ hookId: id, onChange }, hook);
              }
            }
          }

          if (hook.options.listenMeAndChildrenChanges) {
            if (doesPath(path).isChildOf(hook.path)) {
              addListenerTo(
                { hookId, onChange: hook.onChange },
                state.hooks[id],
              );
            }

            if (doesPath(hook.path).isChildOf(path)) {
              addListenerTo(
                { hookId, onChange: hook.onChange },
                state.hooks[id],
              );
            }
          }

          if (hook.options.listenChanges) {
            if (doesPath(path).is(hook.path)) {
              addListenerTo(
                { hookId, onChange: hook.onChange },
                state.hooks[id],
              );
            }
          }

          if (hook.options.listenForeignChanges) {
            for (let i = 0; i < hook.options.listenForeignChanges.length; i++) {
              if (
                doesPath(path).isChildOf(hook.options.listenForeignChanges[i])
              ) {
                addListenerTo(
                  { hookId, onChange: hook.onChange },
                  state.hooks[id],
                );
              }

              if (
                doesPath(hook.options.listenForeignChanges[i]).isChildOf(path)
              ) {
                addListenerTo(
                  { hookId, onChange: hook.onChange },
                  state.hooks[id],
                );
              }
            }
          }
        }
      });

      console.log('after hook register', useModConfigStore.getState());
    },
    unregisterHook: (hookToDelete: string) => {
      immerSet((state) => {
        for (const hookId in state.hooks) {
          const hook = state.hooks[hookId];
          const listenerIndex = hook.listeners.findIndex(
            (listener) => listener.hookId === hookToDelete,
          );

          if (listenerIndex !== -1) {
            hook.listeners.splice(listenerIndex, 1);
          }
        }

        delete state.hooks[hookToDelete];
      });
      console.log('after hook unregister', useModConfigStore.getState());
    },
  })),
);
