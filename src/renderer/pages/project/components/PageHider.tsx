import { memo, PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import { v4 } from 'uuid';

interface PageHiderProps extends PropsWithChildren {
  isVisible: boolean;
  withScroll?: boolean;
}

const PageHider = memo(
  ({ isVisible, withScroll, children }: PageHiderProps) => {
    return (
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
    );
  },
  (prev: PageHiderProps, next: PageHiderProps) =>
    prev.isVisible === next.isVisible && prev.withScroll === next.withScroll,
);

export default PageHider;
