import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface PageHiderProps extends PropsWithChildren {
  isVisible: boolean;
  withScroll?: boolean;
}

export default function PageHider({
  isVisible,
  withScroll,
  children,
}: PageHiderProps) {
  return isVisible ? (
    <div
      style={{ maxHeight: 'calc(100% - 80px)' }}
      className={clsx(
        'p-5 pt-0 w-full flex flex-col flex-1',
        !isVisible && 'hidden',
        withScroll && 'overflow-y-auto',
      )}
    >
      {children}
    </div>
  ) : null;
}
