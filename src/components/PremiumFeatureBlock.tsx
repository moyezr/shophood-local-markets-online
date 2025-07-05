
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface PremiumFeatureBlockProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function PremiumFeatureBlock({ 
  title, 
  description, 
  children, 
  className = "" 
}: PremiumFeatureBlockProps) {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const currentUser = state.currentUser;

  const handleUpgrade = () => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, subscriptionPlan: 'premium' as const };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    
    toast({
      title: 'Upgraded to Premium!',
      description: 'You now have access to all premium features.',
    });
  };

  if (currentUser?.subscriptionPlan === 'premium') {
    return <>{children}</>;
  }

  return (
    <Card className={`border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Lock className="h-12 w-12 text-yellow-600" />
            <Crown className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">{title}</h3>
        <p className="text-yellow-700 mb-4">{description}</p>
        <Button 
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </CardContent>
    </Card>
  );
}
