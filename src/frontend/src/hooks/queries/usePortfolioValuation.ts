import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { PortfolioValuation } from '../../backend';

export function usePortfolioValuation() {
  const { actor, isFetching } = useActor();

  return useQuery<PortfolioValuation>({
    queryKey: ['portfolioValuation'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPortfolioValuation();
    },
    enabled: !!actor && !isFetching,
  });
}
