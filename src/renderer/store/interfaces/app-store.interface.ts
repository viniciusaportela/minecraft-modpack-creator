import Realm from 'realm';
import React from 'react';

export interface IAppStore {
  title: string;
  goBack: null | (() => void);
  setTitle: (title: string) => void;
  realm: Realm;
  setGoBack: (goBack: null | (() => void)) => void;
  headerMiddleComponent?: React.ReactNode;
  setHeaderMiddleComponent: (middleComponent: React.ReactNode) => void;
}
