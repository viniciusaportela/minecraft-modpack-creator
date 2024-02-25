import React from 'react';
import { IProjectMeta } from '../../typings/project-meta.interface';

export interface IAppStore {
  page: string;
  projectMeta: null | IProjectMeta;
  title: string;
  goBack: null | (() => void);
  setPage: (page: string) => void;
  setProjectMeta: (project: IProjectMeta) => void;
  setTitle: (title: string) => void;
  setGoBack: (goBack: null | (() => void)) => void;
  customRightElement?: React.ReactNode;
  setCustomRightElement: (customRightElement: React.ReactNode) => void;
}
