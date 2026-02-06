import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUserProfile';
import { usePortfolioValuation } from '../hooks/queries/usePortfolioValuation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Wallet, PieChart } from 'lucide-react';
import { formatMoney, formatMoneyCompact } from '../components/formatters/money';

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: valuation, isLoading: valuationLoading } = usePortfolioValuation();

  if (profileLoading || valuationLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Cash Balance',
      value: valuation ? formatMoney(valuation.cashBalance) : '$0.00',
      icon: Wallet,
      color: 'text-amber-500',
    },
    {
      title: 'Total Equity',
      value: valuation ? formatMoney(valuation.totalEquity) : '$0.00',
      icon: DollarSign,
      color: 'text-emerald-500',
    },
    {
      title: 'Holdings Value',
      value: valuation ? formatMoney(valuation.holdingsValue) : '$0.00',
      icon: PieChart,
      color: 'text-blue-500',
    },
    {
      title: 'Open Positions',
      value: valuation ? formatMoney(valuation.openPositionsValue) : '$0.00',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your paper trading account</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Your paper trading performance at a glance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Trades</p>
              <p className="text-2xl font-bold">{profile?.tradeHistory.length || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Holdings</p>
              <p className="text-2xl font-bold">{profile?.holdings.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
