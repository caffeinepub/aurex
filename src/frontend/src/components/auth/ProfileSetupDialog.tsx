import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/mutations/useSaveCallerUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        cashBalance: BigInt(100000), // Starting balance: $100,000
        holdings: [],
        tradeHistory: [],
        openLimitOrders: [],
      });
      toast.success('Profile created successfully!');
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Aurex</DialogTitle>
          <DialogDescription>
            Let's set up your paper trading account. You'll start with $100,000 in virtual cash.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saveProfile.isPending} className="w-full">
            {saveProfile.isPending ? 'Creating Account...' : 'Start Trading'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
