import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input } from '@nextui-org/react';
import React from 'react';
import { InputSlots, SlotsToClasses } from '@nextui-org/theme';

interface SearchBarProps {
  text: string;
  onChange: (txt: string) => void;
  className?: string;
  classNames?: SlotsToClasses<InputSlots>;
}

export default function SearchBar({
  text,
  onChange,
  className,
  classNames,
}: SearchBarProps) {
  return (
    <Input
      size="sm"
      value={text}
      endContent={<MagnifyingGlass size={16} className="text-zinc-500" />}
      className={className}
      classNames={{
        inputWrapper: 'h-5',
        ...classNames,
      }}
      onValueChange={(txt) => onChange(txt)}
    />
  );
}
