import { ReactNode } from 'react';
import { ConfigNode } from '../../core/domains/minecraft/config/ConfigNode';
import { IProject } from './project.interface';

export interface IAppStore extends IAppStored {
  userDataPath: string;
  configs: ConfigNode[] | null;
  isLoaded: boolean;
  load: () => void;
  selectedProject: () => IProject;
  headerMiddleComponent: ReactNode;
  title: string;
  goBack: (() => void) | null;
}

export interface IAppStored {
  selectedProjectIndex: number;
  projects: IProject[];
}
