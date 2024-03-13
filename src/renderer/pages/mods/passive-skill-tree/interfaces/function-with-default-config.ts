import React from 'react';

export interface FunctionWithDefaultConfig<T = any, TArgs = never>
  extends React.FC<T> {
  getDefaultConfig: (args: TArgs) => any;
}
