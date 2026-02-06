import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Price } from '../../backend';

export function useAllPrices() {
  const { actor, isFetching } = useActor();

  return useQuery<Price[]>({
    queryKey: ['allPrices'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPrices();
    },
    enabled: !!actor && !isFetching,
  });
}
