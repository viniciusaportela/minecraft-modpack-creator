import Realm, { Types } from 'realm';
import React from 'react';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';

export interface IAppStore {
  title: string;
  goBack: null | (() => void);
  setTitle: (title: string) => void;
  realm: Realm;
  configs: ConfigNode[] | null;
  selectedProjectId: Types.ObjectId;
  setGoBack: (goBack: null | (() => void)) => void;
  headerMiddleComponent?: React.ReactNode;
  setHeaderMiddleComponent: (middleComponent: React.ReactNode) => void;
}
