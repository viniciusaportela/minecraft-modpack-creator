import Realm from 'realm';
import React from 'react';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import { IProject } from './project.interface';

export interface IAppStore extends IAppStored {
  setGoBack: (goBack: null | (() => void)) => void;
  headerMiddleComponent?: React.ReactNode;
  setHeaderMiddleComponent: (middleComponent: React.ReactNode) => void;
  setTitle: (title: string) => void;
  goBack: null | (() => void);
  realm: Realm;
  userDataPath: string;
  setUserDataPath: (userDataPath: string) => void;
  title: string;
  configs: ConfigNode[] | null;
  isLoading: boolean;
  setIsLoaded: () => void;
  selectProject: (index: number) => void;
  selectedProject: IProject | null;
  setProject: (project: IProject) => void;
}

export interface IAppStored {
  selectedProjectIndex: number;
  projects: IProject[];
}
