import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20">
      <div className="container mx-auto px-4 py-3">
        <Alert className="border-amber-500/30 bg-transparent">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm text-amber-200/90">
            <strong>Paper Trading Simulator:</strong> This is a virtual trading platform using simulated money only.
            No real broker integration, no real money, no actual investments. For educational and practice purposes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
