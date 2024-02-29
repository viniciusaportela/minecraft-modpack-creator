import Realm from 'realm';
import { IProjectStrategy } from './interfaces/project-strategy.interface';

export default class MinecraftStrategy implements IProjectStrategy {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  async handle(modpackFolder: string) {}
}
