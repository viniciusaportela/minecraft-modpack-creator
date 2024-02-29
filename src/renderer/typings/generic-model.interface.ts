export interface GenericModel {
  new (...args: any): any;
  schema: { name: string };
}
