
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { 
  ShoppingBag, 
  Store, 
  Search, 
  MessageCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Crown,
  CreditCard
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = state;

  if (!currentUser) return null;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_USER' });
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const unreadMessages = state.messages.filter(
    msg => msg.toUserId === currentUser.id && !msg.read
  ).length;

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
              <ShoppingBag className="h-8 w-8 text-shophood-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-shophood-600 to-shophood-800 bg-clip-text text-transparent">
                ShopHood
              </span>
            </div>
            
            {currentUser.role === 'consumer' && (
              <div className="hidden md:flex items-center space-x-4 ml-8">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Discover</span>
                </Button>
              </div>
            )}

            {currentUser.role === 'business' && (
              <div className="hidden md:flex items-center space-x-4 ml-8">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation('/')}
                >
                  <Store className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                {currentUser.subscriptionPlan === 'premium' && (
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  onClick={() => handleNavigation('/pricing')}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pricing</span>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <MessageCircle className="h-5 w-5" />
              {unreadMessages > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
                >
                  {unreadMessages}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  {currentUser.role === 'business' && currentUser.subscriptionPlan === 'premium' && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                  {currentUser.role === 'business' && (
                    <Badge variant={currentUser.subscriptionPlan === 'premium' ? 'default' : 'secondary'} className="text-xs">
                      {currentUser.subscriptionPlan}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
