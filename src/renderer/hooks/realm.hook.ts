import { useEffect, useState } from 'react';
import { useRealm } from '../store/realm.context';

// TODO type
export function useQuery<T>(
  model: string,
  filter?: (collection: any) => any,
): T[] {
  const realm = useRealm();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const results = realm.objects(model);
    const finalResults = filter ? filter(results) : results;

    finalResults.addListener((results) => {
      setResults([...results.toJSON()]);
    });

    setResults(finalResults.toJSON());

    return () => {
      finalResults.removeAllListeners();
    };
  }, []);

  return results;
}
