export interface IModsStore {
  mods: IMod[];
  version: number;
}

export interface IMod {
  path: string;
  name: string;
  icon: string | null;
  id: string;
  index: number;
}
