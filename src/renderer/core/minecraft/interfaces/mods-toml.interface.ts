export interface IModsToml {
  modLoader: string;
  loaderVersion: string;
  mods: {
    modId: string;
    displayName: string;
    displayURL: string;
    version: string;
    logoFile: string;
    authors: string;
    description: string;
  }[];
  dependencies: Record<
    string,
    {
      modId: string;
      mandatory: boolean;
      versionRange: string;
      side: string;
    }[]
  >;
}
