import { Card, CardBody } from '@nextui-org/react';
import React, { ReactNode } from 'react';

interface IChooseTypeProps {
  onChoose: () => void;
  children: ReactNode;
}

export default function ChooseType({ onChoose, children }: IChooseTypeProps) {
  return (
    <Card onPress={onChoose} isPressable>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
