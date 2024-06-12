export interface IEffectsStore {
  effects: IEffect[];
  version: number;
}

export interface IEffect {
  mod: string;
  name: string;
  id: string;
  index: number;
}
