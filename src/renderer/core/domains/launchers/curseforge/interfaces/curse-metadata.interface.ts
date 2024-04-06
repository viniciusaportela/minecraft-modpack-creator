export interface IMod {
  addonID: number;
  name: string;
  primaryAuthor: string;
  thumbnailUrl: string;
  webSiteURL: string;
  fileNameOnDisk: string;
  status: number;
}

export interface ICurseforgeMetadata {
  name: string;
  baseModLoader: {
    name: string;
  };
  installPath: string;
  gameVersion: string;
  installedAddons: IMod[];
}
