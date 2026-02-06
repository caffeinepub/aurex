import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Holding } from '../../backend';

export function useHoldings() {
  const { actor, isFetching } = useActor();

  return useQuery<Holding[]>({
    queryKey: ['holdings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHoldings();
    },
    enabled: !!actor && !isFetching,
  });
}
