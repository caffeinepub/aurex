import { useHoldings } from '../hooks/queries/useHoldings';
import { useAllPrices } from '../hooks/queries/useAllPrices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';
import { formatMoney } from '../components/formatters/money';

export default function PortfolioPage() {
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: prices, isLoading: pricesLoading } = useAllPrices();

  if (holdingsLoading || pricesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const priceMap = new Map(prices?.map((p) => [p.symbol, p.price]) || []);

  const enrichedHoldings = holdings?.map((holding) => {
    const currentPrice = priceMap.get(holding.symbol) || BigInt(0);
    const positionValue = currentPrice * holding.quantity;
    return {
      ...holding,
      currentPrice,
      positionValue,
    };
  });

  const totalValue = enrichedHoldings?.reduce((sum, h) => sum + h.positionValue, BigInt(0)) || BigInt(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
        <p className="text-muted-foreground">Your current holdings and positions</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Holdings
          </CardTitle>
          <CardDescription>Total Value: {formatMoney(totalValue)}</CardDescription>
        </CardHeader>
        <CardContent>
          {!enrichedHoldings || enrichedHoldings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No holdings yet. Start trading to build your portfolio!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">Position Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrichedHoldings.map((holding) => (
                    <TableRow key={holding.symbol}>
                      <TableCell className="font-medium">{holding.symbol}</TableCell>
                      <TableCell className="text-right">{holding.quantity.toString()}</TableCell>
                      <TableCell className="text-right">
                        {holding.currentPrice > BigInt(0) ? formatMoney(holding.currentPrice) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-500">
                        {formatMoney(holding.positionValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
