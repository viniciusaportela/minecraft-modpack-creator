import { Warning } from '@phosphor-icons/react';
import clsx from 'clsx';

interface AlertProps {
  text: string;
  className?: string;
}

export default function Alert({ text, className }: AlertProps) {
  return (
    <div
      className={clsx(
        'bg-danger-300 p-3 rounded-md flex items-center drop-shadow-md',
        className,
      )}
    >
      <Warning size={20} weight="bold" className="min-w-[20px]" />
      <span className="ml-2">{text}</span>
    </div>
  );
}
