import React, { useEffect } from 'react';

export default function useInitializationEffect(
  callback: (...args: any) => any,
  deps: any[],
) {
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (!hasRun.current && deps.every((dep) => dep !== undefined)) {
      hasRun.current = true;
      callback();
    }
  }, [...deps]);
}
