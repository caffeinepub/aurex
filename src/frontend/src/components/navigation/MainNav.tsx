import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, TrendingUp, Briefcase, History } from 'lucide-react';

type ActivePage = 'dashboard' | 'trade' | 'portfolio' | 'history';

interface MainNavProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export default function MainNav({ activePage, onPageChange }: MainNavProps) {
  return (
    <Tabs value={activePage} onValueChange={(value) => onPageChange(value as ActivePage)} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        <TabsTrigger value="dashboard" className="gap-2 py-3">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="trade" className="gap-2 py-3">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Trade</span>
        </TabsTrigger>
        <TabsTrigger value="portfolio" className="gap-2 py-3">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Portfolio</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2 py-3">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
