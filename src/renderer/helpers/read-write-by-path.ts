export function curriedReadByPath<T = any>(
  currentState: any,
): (path: string[]) => T {
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
