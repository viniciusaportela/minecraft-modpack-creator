import React from 'react';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import { IProject } from './project.interface';

export interface IAppStore extends IAppStored {
  headerMiddleComponent?: React.ReactNode;
  goBack: null | (() => void);
  userDataPath: string;
  title: string;
  configs: ConfigNode[] | null;
  isLoading: boolean;
  selectedProject: IProject | null;
}

export interface IAppStored {
  selectedProjectIndex: number;
  projects: IProject[];
}
