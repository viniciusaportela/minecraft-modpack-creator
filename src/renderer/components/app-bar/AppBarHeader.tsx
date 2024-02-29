import React, { PropsWithChildren, useLayoutEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
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
  const { setGoBack, setTitle, setHeaderMiddleComponent } = useAppStore(
    useShallow((st) => ({
      setGoBack: st.setGoBack,
      setTitle: st.setTitle,
      setHeaderMiddleComponent: st.setHeaderMiddleComponent,
    })),
  );

  useLayoutEffect(() => {
    setTitle(title);
  }, [title]);

  useLayoutEffect(() => {
    setGoBack(goBack || null);
  }, [goBack]);

  useLayoutEffect(() => {
    setHeaderMiddleComponent(children);
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
