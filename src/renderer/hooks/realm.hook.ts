import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BSON } from 'realm';
import { useRealm } from '../store/realm.context';
import { GenericModel } from '../typings/generic-model.interface';

// TODO type
export function useQuery<T extends GenericModel>(
  model: T,
  filter?: (collection: any) => any,
): InstanceType<T>[] {
  const realm = useRealm();

  const getResults = () => {
    const res = realm.objects(model.schema.name);
    return filter ? filter(res) : res;
  };

  const objectsRef = useRef(getResults());
  const [_, setInternalIndex] = useState(0);

  useLayoutEffect(() => {
    objectsRef.current.addListener((_, changes) => {
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

  return objectsRef.current as InstanceType<T>[];
}

export function useQueryById<T extends GenericModel>(
  model: T,
  id: string,
): InstanceType<T> | null {
  const realm = useRealm();

  const getObject = () => {
    return realm.objectForPrimaryKey(model.schema.name, new BSON.ObjectId(id))!;
  };

  const objectRef = useRef(getObject());
  const [_, setInternalIndex] = useState(0);

  useEffect(() => {
    objectRef.current.addListener((_, changes) => {
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

export function useQueryFirst<T extends GenericModel>(model: T) {
  const realm = useRealm();

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
