import { CSSProperties, PropsWithChildren } from 'react';
import clsx from 'clsx';

export default function Label({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>) {
  return (
    <span className={clsx('text-[14px] -mb-1', className)} style={style}>
      {children}
    </span>
  );
}
