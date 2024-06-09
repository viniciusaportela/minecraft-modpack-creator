import { useRef } from 'react';
import { shallow } from 'zustand/shallow';

export function useShallow<S, U>(selector: (state: S) => U): (state: S) => U {
  const prev = useRef<U>();

  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next)
      ? (prev.current as U)
      : (prev.current = state); // we are returning state instead of next due to was created by selector
  };
}
