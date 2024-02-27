import React from 'react';
import { IProjectMeta } from '../../typings/project-meta.interface';

export interface IAppStore {
  projectMeta: null | IProjectMeta;
  title: string;
  goBack: null | (() => void);
  setProjectMeta: (project: IProjectMeta) => void;
  setTitle: (title: string) => void;
  setGoBack: (goBack: null | (() => void)) => void;
  customRightElement?: React.ReactNode;
  setCustomRightElement: (customRightElement: React.ReactNode) => void;
}
