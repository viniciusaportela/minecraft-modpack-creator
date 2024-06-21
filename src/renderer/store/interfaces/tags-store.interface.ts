export interface ITagsStore {
  tags: ITag[];
  version: number;
}

export type ITag = {
  name: string;
  items: string[];
};
