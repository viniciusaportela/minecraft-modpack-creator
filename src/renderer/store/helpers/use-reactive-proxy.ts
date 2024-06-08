import { useSnapshot } from 'valtio';

export function useReactiveProxy<T extends Object>(proxy: T): T {
  useSnapshot(proxy);
  return proxy;
}
