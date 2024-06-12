import { useModsStore } from '../mods.store';

export function useModById(id: string) {
  return useModsStore((st) => st.mods.find((m) => m.id === id));
}
