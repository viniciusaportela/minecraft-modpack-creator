export interface IEntitiesStore {
  entities: IEntity[];
  version: number;
}

export interface IEntity {
  mod: string;
  name: string;
  id: string;
  index: number;
}
