export interface IMod {
  addonID: number;
  name: string;
  primaryAuthor: string;
  thumbnailUrl: string;
  webSiteURL: string;
  status: number;
}

export interface IProjectMeta {
  name: string;
  baseModLoader: {
    name: string;
  };
  installPath: string;
  gameVersion: string;
  installedAddons: IMod[];
}
