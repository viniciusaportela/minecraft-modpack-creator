import { createContext, PropsWithChildren } from 'react';
import { StoreApi } from 'zustand/vanilla';
import { useAppStore } from '../app.store';
import { IProjectStore } from '../interfaces/project-store.interface';
import { ModConfigProvider } from './mod-config-provider';
import { ContextStoreRegistry } from '../context-store-registry';

const ProjectConfigCtx = createContext<StoreApi<IProjectStore> | null>(null);

export default function ProjectConfigProvider({ children }: PropsWithChildren) {
  const { selectedProject } = useAppStore();

  return (
    <ProjectConfigCtx.Provider
      value={
        selectedProject()
          ? ContextStoreRegistry.getInstance().getProjectStore()
          : null
      }
    >
      {children}
    </ProjectConfigCtx.Provider>
  );
}
