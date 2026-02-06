import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Price } from '../../backend';

export function usePrice(symbol: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Price | null>({
    queryKey: ['price', symbol],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPrice(symbol);
    },
    enabled: !!actor && !isFetching && !!symbol,
  });
}
