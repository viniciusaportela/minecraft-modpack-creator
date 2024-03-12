import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BSON, Results, Types } from 'realm';
import { RealmObject } from 'realm/dist/Object';
import intersection from 'lodash.intersection';
import { GenericModel } from '../typings/generic-model.interface';
import { useAppStore } from '../store/app.store';

// TODO type
export function useQuery<T extends GenericModel>(
  model: T,
  filter?: (collection: any) => any,
): InstanceType<T>[] {
  const realm = useAppStore((st) => st.realm);

  const getResults = (): Results<RealmObject<T>> => {
    const res = realm.objects(model.schema.name);
    return filter ? filter(res) : res;
  };

  const objectsRef = useRef(getResults());
  const [_, setInternalIndex] = useState(0);

  useLayoutEffect(() => {
    objectsRef.current.addListener((_updated, changes) => {
      if (
        changes.deletions.length > 0 ||
        changes.insertions.length > 0 ||
        changes.newModifications.length > 0
      ) {
        setInternalIndex((idx) => idx + 1);
      }
    });

    return () => {
      objectsRef.current.removeAllListeners();
    };
  }, []);

  return objectsRef.current;
}

export function useQueryById<T extends GenericModel>(
  model: T,
  id: Types.ObjectId,
  listenerIgnorePaths?: string[],
): InstanceType<T> | null {
  const realm = useAppStore((st) => st.realm);

  const getObject = () => {
    return realm.objectForPrimaryKey(model.schema.name, new BSON.ObjectId(id))!;
  };

  const objectRef = useRef(getObject());
  const [_, setInternalIndex] = useState(0);

  useEffect(() => {
    objectRef.current.addListener((_, changes) => {
      if (
        (changes.changedProperties.length > 0 &&
          intersection(changes.changedProperties, listenerIgnorePaths)
            .length === 0) ||
        changes.deleted
      ) {
        setInternalIndex((idx) => idx + 1);
      }
    });

    return () => {
      objectRef.current.removeAllListeners();
    };
  }, []);

  return objectRef.current as InstanceType<T>;
}

export function useQueryFirst<T extends GenericModel>(model: T) {
  const realm = useAppStore((st) => st.realm);

  const getFirst = () => {
    return realm.objects(model.schema.name)[0];
  };

  const [_, setInternalIndex] = useState(0);
  const objectRef = useRef(getFirst());

  useEffect(() => {
    objectRef.current.addListener((newObject, changes) => {
      if (changes.changedProperties.length > 0 || changes.deleted) {
        setInternalIndex((idx) => idx + 1);
      }
    });

    return () => {
      objectRef.current.removeAllListeners();
    };
  }, []);

  return objectRef.current as InstanceType<T>;
}
