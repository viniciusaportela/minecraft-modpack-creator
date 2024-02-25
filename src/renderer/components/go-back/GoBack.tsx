import { Button } from '@nextui-org/react';
import { CaretLeft } from '@phosphor-icons/react';
import React from 'react';

interface IGoBackProps {
  goBack: () => void;
  title: string;
}

export default function GoBack({ goBack, title }: IGoBackProps) {
  return (
    <div className="flex items-center">
      <Button
        variant="light"
        onPress={goBack}
        size="sm"
        className="p-2 min-w-4 mr-1"
      >
        <CaretLeft size={20} />
      </Button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
