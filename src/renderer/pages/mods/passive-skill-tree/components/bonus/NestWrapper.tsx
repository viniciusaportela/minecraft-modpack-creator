import { FC, PropsWithChildren } from 'react';

interface NestWrapperProps extends PropsWithChildren {
  nestLevel: number;
}

export const NestWrapper: FC<NestWrapperProps> = ({ children, nestLevel }) => {
  return (
    <div
      style={{ paddingLeft: nestLevel - 7 > 0 ? 12 : 0 }}
      className="flex flex-col gap-2"
    >
      {children}
    </div>
  );
};
