import { useTradeHistory } from '../hooks/queries/useTradeHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { formatMoney } from '../components/formatters/money';
import { OrderType } from '../backend';

export default function HistoryPage() {
  const { data: trades, isLoading } = useTradeHistory();

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Trade History</h2>
        <p className="text-muted-foreground">Your past paper trading activity</p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Executed Trades
          </CardTitle>
          <CardDescription>All your completed paper trades</CardDescription>
        </CardHeader>
        <CardContent>
          {!trades || trades.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trade history yet. Place your first order to get started!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Entry Price</TableHead>
                    <TableHead className="text-right">Exit Price</TableHead>
                    <TableHead className="text-right">P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade, index) => {
                    const isBuy = trade.orderType === OrderType.buy;
                    const profitLoss = Number(trade.profitLoss);
                    const isProfit = profitLoss > 0;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{trade.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={isBuy ? 'default' : 'destructive'} className="gap-1">
                            {isBuy ? (
                              <>
                                <TrendingUp className="h-3 w-3" />
                                Buy
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3 w-3" />
                                Sell
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{trade.positionSize.toString()}</TableCell>
                        <TableCell className="text-right">{formatMoney(trade.entryPrice)}</TableCell>
                        <TableCell className="text-right">{formatMoney(trade.exitPrice)}</TableCell>
                        <TableCell className={`text-right font-semibold ${isProfit ? 'text-emerald-500' : 'text-destructive'}`}>
                          {profitLoss > 0 ? '+' : ''}
                          {formatMoney(trade.profitLoss)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
