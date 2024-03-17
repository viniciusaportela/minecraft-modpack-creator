import React from 'react';

export interface FunctionWithDefaultConfig<
  TProps = { path: string[] },
  TDefaultConfigArgs = never,
> extends React.FC<TProps> {
  getDefaultConfig: (args?: TDefaultConfigArgs) => any;
}
