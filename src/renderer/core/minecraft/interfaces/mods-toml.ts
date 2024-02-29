export interface IModsToml {
  modLoader: string;
  loaderVersion: string;
  mods: {
    modId: string;
    displayName: string;
    displayURL: string;
    logoFile: string;
    authors: string;
    description: string;
  };
  dependencies: {
    modId: string;
    mandatory: boolean;
    versionRange: string;
    side: string;
  }[];
}
