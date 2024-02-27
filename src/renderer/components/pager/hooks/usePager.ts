import { useContext, useEffect } from 'react';
import { PagerContext } from '../Pager';

export function usePager() {
  return useContext(PagerContext);
}

export function usePagerTitle(title: string) {
  const { setTitle } = usePager();

  useEffect(() => {
    setTitle(title);
  }, [title]);
}
