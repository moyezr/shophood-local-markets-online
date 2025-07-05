
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '../contexts/AppContext';
import { User } from '../types';
import { ShoppingBag, Store, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<'consumer' | 'business'>('consumer');

  const handleLogin = () => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN_USER', payload: user });
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.name}`,
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive'
      });
    }
  };

  const handleSignup = () => {
    const existingUser = state.users.find(u => u.email === email);
    if (existingUser) {
      toast({
        title: 'Account exists',
        description: 'An account with this email already exists',
        variant: 'destructive'
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      subscriptionPlan: 'free',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    dispatch({ type: 'LOAD_STATE', payload: {
      ...state,
      users: [...state.users, newUser]
    }});

    dispatch({ type: 'LOGIN_USER', payload: newUser });
    
    toast({
      title: 'Account created!',
      description: `Welcome to ShopHood, ${name}!`,
    });
  };

  const quickLogin = (userEmail: string) => {
    const user = state.users.find(u => u.email === userEmail);
    if (user) {
      dispatch({ type: 'LOGIN_USER', payload: user });
      toast({
        title: 'Quick login successful!',
        description: `Logged in as ${user.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shophood-50 via-white to-shophood-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-8 w-8 text-shophood-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-shophood-600 to-shophood-800 bg-clip-text text-transparent">
              ShopHood
            </h1>
          </div>
          <p className="text-gray-600">Connect with local businesses in your neighborhood</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <Tabs value={isSignup ? 'signup' : 'login'} onValueChange={(value) => setIsSignup(value === 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>Sign in to your ShopHood account</CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle>Join ShopHood</CardTitle>
                <CardDescription>Create your account to get started</CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Tabs value={role} onValueChange={(value) => setRole(value as 'consumer' | 'business')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="consumer" className="flex items-center space-x-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Consumer</span>
                      </TabsTrigger>
                      <TabsTrigger value="business" className="flex items-center space-x-2">
                        <Store className="h-4 w-4" />
                        <span>Business</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={isSignup ? handleSignup : handleLogin}
              className="w-full bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700 text-white"
              disabled={!email || !password || (isSignup && !name)}
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                onClick={() => quickLogin('john@example.com')}
                className="flex items-center space-x-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Consumer Demo</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('sarah@bakery.com')}
                className="flex items-center space-x-2"
              >
                <Store className="h-4 w-4" />
                <span>Free Business Demo</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('mike@electronics.com')}
                className="flex items-center space-x-2"
              >
                <Store className="h-4 w-4 text-yellow-500" />
                <span>Premium Business Demo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
