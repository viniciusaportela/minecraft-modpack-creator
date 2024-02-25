export interface IMod {
  addonID: number;
  name: string;
  primaryAuthor: string;
  thumbnailUrl: string;
  webSiteURL: string;
  /**
   * Status 5 means the mod is installed but disabled
   */
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
