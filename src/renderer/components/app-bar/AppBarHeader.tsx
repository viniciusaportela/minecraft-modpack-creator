import React, { PropsWithChildren, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { useAppStore } from '../../store/app.store';

interface AppBarHeaderProps {
  title: string;
  children?: React.ReactNode;
  goBack?: (() => void) | null;
}

export default function AppBarHeader({
  title,
  children,
  goBack,
}: AppBarHeaderProps) {
  useLayoutEffect(() => {
    useAppStore.setState((st) => {
      st.title = title;
    });
  }, [title]);

  useLayoutEffect(() => {
    useAppStore.setState((st) => {
      st.goBack = goBack || null;
    });
  }, [goBack]);

  useLayoutEffect(() => {
    useAppStore.setState((st) => {
      st.headerMiddleComponent = children;
    });
  }, [children]);

  return null;
}

export function AppBarHeaderContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={clsx(
        'flex flex-1 justify-center items-center h-full',
        className,
      )}
    >
      {children}
    </div>
  );
}
