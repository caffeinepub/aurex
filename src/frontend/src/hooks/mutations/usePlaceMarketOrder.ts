import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Symbol, OrderType } from '../../backend';

interface PlaceMarketOrderParams {
  symbol: Symbol;
  orderType: OrderType;
  quantity: bigint;
}

export function usePlaceMarketOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ symbol, orderType, quantity }: PlaceMarketOrderParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeMarketOrder(symbol, orderType, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioValuation'] });
      queryClient.invalidateQueries({ queryKey: ['tradeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
