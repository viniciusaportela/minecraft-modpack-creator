import { Button } from '@nextui-org/react';
import { CaretLeft } from '@phosphor-icons/react';
import { ReactNode } from 'react';

interface ITitleProps {
  children: ReactNode;
  goBack?: () => void;
  className?: string;
}

export default function Title({ children, goBack, className }: ITitleProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {goBack && (
        <Button
          variant="light"
          onPress={goBack}
          size="sm"
          className="p-2 min-w-4 mr-1"
        >
          <CaretLeft size={20} />
        </Button>
      )}

      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
}
