import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Trade } from '../../backend';

export function useTradeHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Trade[]>({
    queryKey: ['tradeHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      return profile?.tradeHistory || [];
    },
    enabled: !!actor && !isFetching,
  });
}
