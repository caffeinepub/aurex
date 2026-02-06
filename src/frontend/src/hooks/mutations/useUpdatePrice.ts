import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Price } from '../../backend';

export function useUpdatePrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (price: Price) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePrice(price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price'] });
      queryClient.invalidateQueries({ queryKey: ['allPrices'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioValuation'] });
    },
  });
}
