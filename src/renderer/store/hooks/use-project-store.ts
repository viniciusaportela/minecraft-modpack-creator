import { LazyStoreRegistry } from '../lazy-store-registry';
import { IProjectStore } from '../interfaces/project-store.interface';

export function useProjectSelector<T>(
  selector: (store: IProjectStore) => T,
): T {
  return LazyStoreRegistry.getInstance().getProjectStore()(selector);
}

export function useProjectStore() {
  return LazyStoreRegistry.getInstance().getProjectStore();
}
