import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface PageHiderProps extends PropsWithChildren {
  isVisible: boolean;
}

export default function PageHider({ isVisible, children }: PageHiderProps) {
  return isVisible ? (
    <div
      className={clsx(
        'p-5 pt-0 w-full flex flex-col flex-1',
        !isVisible && 'hidden',
      )}
    >
      {children}
    </div>
  ) : null;
}
