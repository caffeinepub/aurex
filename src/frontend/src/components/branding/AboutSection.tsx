import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Target, Shield } from 'lucide-react';

export default function AboutSection() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          About Aurex
        </CardTitle>
        <CardDescription>Your paper trading platform for learning and practice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-amber-500" />
              <span>Leadership</span>
            </div>
            <p className="text-sm text-muted-foreground">CEO: Harsh Gupta</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Mission</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering traders with risk-free practice and learning tools
            </p>
          </div>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground leading-relaxed">
          Aurex is a paper trading simulator designed to help you learn trading strategies and practice market
          decisions without risking real money. All trades are simulated using virtual cash, providing a safe
          environment to develop your skills.
        </p>
      </CardContent>
    </Card>
  );
}
