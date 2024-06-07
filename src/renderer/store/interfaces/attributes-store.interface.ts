export interface IAttributesStore {
  attributes: IAttribute[];
  version: number;
}

export interface IAttribute {
  id: string;
  name: string;
  index: number;
}
