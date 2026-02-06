import { TrendingUp } from 'lucide-react';

export default function AurexBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img src="/assets/generated/aurex-logo.dim_512x512.png" alt="Aurex" className="h-10 w-10" />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          Aurex
        </h1>
        <TrendingUp className="h-5 w-5 text-emerald-500" />
      </div>
    </div>
  );
}
