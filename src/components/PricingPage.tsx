
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PricingPage() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const currentUser = state.currentUser;

  const handleUpgrade = () => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, subscriptionPlan: 'premium' as const };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    
    toast({
      title: 'Welcome to Premium!',
      description: 'You now have access to all premium features including unlimited products and advanced analytics.',
    });
  };

  const features = {
    free: [
      'Up to 3 product listings',
      'Basic business profile',
      'Customer messaging',
      'Basic search visibility',
      'Community support'
    ],
    premium: [
      'Unlimited product listings',
      'Priority search placement',
      'Advanced analytics dashboard',
      'Sponsored advertising',
      'Customer insights',
      'Priority support',
      'Custom business branding',
      'Export data & reports'
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free and upgrade when you're ready to grow your business on ShopHood
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <Star className="h-12 w-12 text-gray-500" />
            </div>
            <CardTitle className="text-2xl">Free Plan</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              className="w-full mt-6"
              disabled={currentUser?.subscriptionPlan === 'free'}
            >
              {currentUser?.subscriptionPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-shophood-500 shadow-lg">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-shophood-500 to-shophood-600 text-white px-4 py-1">
              <Crown className="h-4 w-4 mr-1" />
              Most Popular
            </Badge>
          </div>
          <CardHeader className="text-center pb-8 pt-8">
            <div className="flex justify-center mb-4">
              <Zap className="h-12 w-12 text-shophood-600" />
            </div>
            <CardTitle className="text-2xl text-shophood-600">Premium Plan</CardTitle>
            <CardDescription>Everything you need to succeed</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-shophood-600">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-shophood-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={handleUpgrade}
              className="w-full mt-6 bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
              disabled={currentUser?.subscriptionPlan === 'premium'}
            >
              {currentUser?.subscriptionPlan === 'premium' ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Current Plan
                </>
              ) : (
                'Upgrade to Premium'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens to my data if I downgrade?</h3>
            <p className="text-gray-600">Your data remains safe. You'll just lose access to premium features, and product listings may be limited.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600">We offer a 30-day money-back guarantee for all premium subscriptions.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
            <p className="text-gray-600">No setup fees! Pay only the monthly subscription fee with no hidden costs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
