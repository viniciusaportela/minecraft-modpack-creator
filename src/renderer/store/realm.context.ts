import Realm from 'realm';
import { createContext, useContext } from 'react';

export const RealmContext = createContext<Realm | null>(null);

export const useRealm = () => {
  return useContext(RealmContext) as Realm;
};
