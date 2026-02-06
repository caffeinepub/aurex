import { useState } from 'react';
import { usePlaceMarketOrder } from '../hooks/mutations/usePlaceMarketOrder';
import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatMoney } from '../components/formatters/money';
import PriceManager from '../components/prices/PriceManager';
import { OrderType } from '../backend';

export default function TradePage() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const placeOrder = usePlaceMarketOrder();
  const { data: profile } = useGetCallerUserProfile();

  const handlePlaceOrder = async () => {
    if (!symbol.trim()) {
      toast.error('Please enter a symbol');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      await placeOrder.mutateAsync({
        symbol: symbol.toUpperCase(),
        orderType: orderType === 'buy' ? OrderType.buy : OrderType.sell,
        quantity: BigInt(qty),
      });
      toast.success(`${orderType.toUpperCase()} order placed successfully!`);
      setSymbol('');
      setQuantity('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to place order';
      if (errorMessage.includes('Insufficient funds')) {
        toast.error('Insufficient cash balance for this purchase');
      } else if (errorMessage.includes('Insufficient holdings')) {
        toast.error('You do not have enough shares to sell');
      } else if (errorMessage.includes('Symbol does not exist')) {
        toast.error('Please set a price for this symbol first');
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trade</h2>
        <p className="text-muted-foreground">Place buy or sell orders with virtual money</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
            <CardDescription>Enter symbol and quantity to trade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL, TSLA"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Number of shares"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy" className="flex items-center gap-2 cursor-pointer">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Buy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell" className="flex items-center gap-2 cursor-pointer">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    Sell
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Orders execute at the current price set for the symbol. Make sure to set a price before trading.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handlePlaceOrder}
              disabled={placeOrder.isPending}
              className="w-full"
              variant={orderType === 'buy' ? 'default' : 'destructive'}
            >
              {placeOrder.isPending ? 'Placing Order...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${symbol || 'Stock'}`}
            </Button>

            {profile && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Available Cash</p>
                <p className="text-xl font-bold text-emerald-500">{formatMoney(profile.cashBalance)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {symbol && <PriceManager symbol={symbol.toUpperCase()} />}
      </div>
    </div>
  );
}
