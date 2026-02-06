import { useState } from 'react';
import { usePrice } from '../../hooks/queries/usePrice';
import { useUpdatePrice } from '../../hooks/mutations/useUpdatePrice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatMoney } from '../formatters/money';

interface PriceManagerProps {
  symbol: string;
}

export default function PriceManager({ symbol }: PriceManagerProps) {
  const [priceInput, setPriceInput] = useState('');
  const { data: currentPrice, isLoading } = usePrice(symbol);
  const updatePrice = useUpdatePrice();

  const handleUpdatePrice = async () => {
    const price = parseFloat(priceInput);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await updatePrice.mutateAsync({
        symbol,
        price: BigInt(Math.round(price * 100)), // Store as cents
      });
      toast.success(`Price updated for ${symbol}`);
      setPriceInput('');
    } catch (error) {
      toast.error('Failed to update price');
      console.error(error);
    }
  };

  return (
    <Card className="bg-accent/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Current Price
        </CardTitle>
        <CardDescription>Set the latest price for {symbol}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading price...</div>
        ) : currentPrice ? (
          <div className="flex items-center gap-2 text-lg font-semibold text-emerald-500">
            <DollarSign className="h-5 w-5" />
            {formatMoney(currentPrice.price)}
          </div>
        ) : (
          <div className="text-sm text-amber-500">No price set yet</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="price">Update Price</Label>
          <div className="flex gap-2">
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdatePrice()}
            />
            <Button onClick={handleUpdatePrice} disabled={updatePrice.isPending}>
              {updatePrice.isPending ? 'Updating...' : 'Set'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
