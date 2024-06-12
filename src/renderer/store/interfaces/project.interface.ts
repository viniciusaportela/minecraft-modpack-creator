export interface IProject {
  name: string;
  path: string;
  minecraftVersion: string;
  loaderVersion: string;
  loader: string;
  launcher: string;
  modCount?: number;
  isLoaded: boolean;
  orphan: boolean;
  lastOpenAt: number | null;
  index: number;
}
