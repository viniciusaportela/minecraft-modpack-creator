import { PropsWithChildren } from 'react';

export default function Label({ children }: PropsWithChildren) {
  return <span className="text-[14px] -mb-1">{children}</span>;
}
