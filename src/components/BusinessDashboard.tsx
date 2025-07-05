import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useApp } from '../contexts/AppContext';
import { BusinessProfile, Product, AdSlot } from '../types';
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  MessageCircle,
  Target,
  Eye,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PremiumFeatureBlock } from './PremiumFeatureBlock';
import { AdCreationDialog } from './AdCreationDialog';
import { useNavigate } from 'react-router-dom';

const BUSINESS_TYPES = [
  'Food & Beverage',
  'Electronics', 
  'Fashion',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Recreation',
  'Automotive',
  'Services'
];

const PRODUCT_CATEGORIES = [
  'Bakery',
  'Electronics',
  'Fashion',
  'Health & Beauty',
  'Home Decor',
  'Sports Equipment',
  'Automotive Parts',
  'Professional Services'
];

export function BusinessDashboard() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [editingAd, setEditingAd] = useState<AdSlot | null>(null);

  const currentUser = state.currentUser!;
  const businessProfile = state.businessProfiles.find(bp => bp.ownerUserId === currentUser.id);
  const businessProducts = state.products.filter(p => p.businessId === businessProfile?.id);
  const businessAds = state.adSlots.filter(ad => ad.businessId === businessProfile?.id);

  const handleUpgradeToPremium = () => {
    const updatedUser = { ...currentUser, subscriptionPlan: 'premium' as const };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    toast({
      title: 'Upgraded to Premium!',
      description: 'You now have access to unlimited listings and analytics.',
    });
  };

  const handleCreateProfile = (profileData: Partial<BusinessProfile>) => {
    const newProfile: BusinessProfile = {
      id: Date.now().toString(),
      ownerUserId: currentUser.id,
      name: profileData.name || '',
      description: profileData.description || '',
      type: profileData.type || 'Services',
      location: profileData.location || 'Downtown District',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      contactEmail: profileData.contactEmail || currentUser.email,
      contactPhone: profileData.contactPhone || '',
      images: [],
      rating: 5.0,
      reviewCount: 0
    };

    dispatch({ type: 'ADD_BUSINESS_PROFILE', payload: newProfile });
    toast({
      title: 'Business profile created!',
      description: 'Your business is now live on ShopHood.',
    });
  };

  const handleCreateProduct = (productData: Partial<Product>) => {
    if (!businessProfile) return;

    if (currentUser.subscriptionPlan === 'free' && businessProducts.length >= 3) {
      toast({
        title: 'Upgrade required',
        description: 'Free accounts can only have 3 products. Upgrade to Premium for unlimited listings.',
        variant: 'destructive'
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      businessId: businessProfile.id,
      name: productData.name || '',
      description: productData.description || '',
      price: productData.price || 0,
      availability: productData.availability ?? true,
      category: productData.category || 'Services'
    };

    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setShowProductForm(false);
    setEditingProduct(null);
    toast({
      title: 'Product added!',
      description: 'Your product is now available to customers.',
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleUpdateProduct = (productData: Partial<Product>) => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      ...productData
    };

    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    setShowProductForm(false);
    setEditingProduct(null);
    toast({
      title: 'Product updated!',
      description: 'Your product changes have been saved.',
    });
  };

  const handleDeleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    toast({
      title: 'Product deleted',
      description: 'The product has been removed from your listings.',
    });
  };

  const handleCreateAd = (adData: Partial<AdSlot>) => {
    if (!businessProfile) return;

    const newAd: AdSlot = {
      id: Date.now().toString(),
      businessId: businessProfile.id,
      type: adData.type || 'sponsored',
      active: true,
      bidAmount: adData.bidAmount || 10,
      title: adData.title || businessProfile.name,
      description: adData.description || businessProfile.description
    };

    dispatch({ type: 'ADD_AD_SLOT', payload: newAd });
    toast({
      title: 'Advertisement created!',
      description: 'Your ad is now active and will appear in search results.',
    });
  };

  const handleEditAd = (ad: AdSlot) => {
    setEditingAd(ad);
    setShowAdDialog(true);
  };

  const handleUpdateAd = (adData: Partial<AdSlot>) => {
    if (!editingAd) return;

    const updatedAd: AdSlot = {
      ...editingAd,
      ...adData
    };

    dispatch({ type: 'UPDATE_AD_SLOT', payload: updatedAd });
    setEditingAd(null);
    toast({
      title: 'Advertisement updated!',
      description: 'Your ad changes have been saved.',
    });
  };

  const handleDeleteAd = (adId: string) => {
    const updatedAds = state.adSlots.filter(ad => ad.id !== adId);
    dispatch({ type: 'LOAD_STATE', payload: { ...state, adSlots: updatedAds } });
    toast({
      title: 'Advertisement deleted',
      description: 'The advertisement has been removed.',
    });
  };

  const handleToggleAdStatus = (ad: AdSlot) => {
    const updatedAd = { ...ad, active: !ad.active };
    dispatch({ type: 'UPDATE_AD_SLOT', payload: updatedAd });
    toast({
      title: ad.active ? 'Advertisement paused' : 'Advertisement activated',
      description: `Your ad is now ${ad.active ? 'paused' : 'active'}.`,
    });
  };

  if (!businessProfile) {
    return <BusinessProfileForm onSubmit={handleCreateProfile} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{businessProfile.name}</h1>
          <p className="text-gray-600">{businessProfile.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={currentUser.subscriptionPlan === 'premium' ? 'default' : 'secondary'}>
            {currentUser.subscriptionPlan === 'premium' && <Crown className="h-3 w-3 mr-1" />}
            {currentUser.subscriptionPlan.toUpperCase()}
          </Badge>
          {currentUser.subscriptionPlan === 'free' && (
            <Button onClick={handleUpgradeToPremium} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessProducts.length}</div>
            {currentUser.subscriptionPlan === 'free' && (
              <p className="text-xs text-muted-foreground">
                {3 - businessProducts.length} remaining
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessAds.filter(ad => ad.active).length}</div>
            <p className="text-xs text-muted-foreground">
              ${businessAds.reduce((sum, ad) => sum + ad.bidAmount, 0)} total bid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessProfile.rating}</div>
            <p className="text-xs text-muted-foreground">
              {businessProfile.reviewCount} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {state.messages.filter(m => m.toUserId === currentUser.id && !m.read).length}
            </div>
            <p className="text-xs text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Business Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="outline">{businessProfile.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{businessProfile.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contact:</span>
                  <span className="text-sm font-medium">{businessProfile.contactPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Profile created successfully</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{businessProducts.length} products added</span>
                  </div>
                  {businessAds.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Advertisement campaign active</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Profile views: 247 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowProductForm(true)}
                  className="w-full justify-start"
                  disabled={currentUser.subscriptionPlan === 'free' && businessProducts.length >= 3}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <Button 
                  onClick={() => setShowAdDialog(true)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Create Ad
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/messages')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          {currentUser.subscriptionPlan === 'premium' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Profile Views</div>
                    <div className="text-xs text-green-600">+12% this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-gray-600">Customer Inquiries</div>
                    <div className="text-xs text-green-600">+8% this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600">Products Favorited</div>
                    <div className="text-xs text-green-600">+15% this week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">7.1%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                    <div className="text-xs text-green-600">+2.1% this week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PremiumFeatureBlock
              title="Performance Overview"
              description="Track your business performance, view detailed analytics, and monitor conversion rates with Premium."
            />
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Products</h2>
            <Button 
              onClick={() => setShowProductForm(true)}
              disabled={currentUser.subscriptionPlan === 'free' && businessProducts.length >= 3}
              className="bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessProducts.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-shophood-600">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Available:</span>
                      <Switch checked={product.availability} />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentUser.subscriptionPlan === 'free' && businessProducts.length >= 3 && (
            <PremiumFeatureBlock
              title="Upgrade to add more products"
              description="Free accounts are limited to 3 products. Upgrade to Premium for unlimited listings and better visibility."
            />
          )}
        </TabsContent>

        <TabsContent value="advertising" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Advertising Campaigns</h2>
            <Button 
              onClick={() => setShowAdDialog(true)}
              className="bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ad
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessAds.map(ad => (
              <Card key={ad.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{ad.title}</CardTitle>
                      <CardDescription>{ad.description}</CardDescription>
                    </div>
                    <Badge variant={ad.active ? 'default' : 'secondary'}>
                      {ad.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <Badge variant="outline" className="capitalize">{ad.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bid Amount:</span>
                    <span className="font-medium">${ad.bidAmount}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditAd(ad)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleAdStatus(ad)}
                    >
                      {ad.active ? 'Pause' : 'Activate'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this advertisement? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteAd(ad.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {currentUser.subscriptionPlan === 'premium' ? (
            <>
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              
              {/* Enhanced Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$2,547</div>
                    <p className="text-xs text-green-600">+12.5% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-green-600">+8.2% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Engagement</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-blue-600">Messages received</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7.1%</div>
                    <p className="text-xs text-green-600">+2.1% improvement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businessProducts.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="flex justify-between items-center">
                          <span className="text-sm">{product.name}</span>
                          <div className="text-right">
                            <div className="font-medium">${(product.price * (5 - index)).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">{5 - index} sales</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Age 25-34</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Age 35-44</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Age 18-24</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Age 45+</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {businessProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-shophood-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-shophood-600">{index + 1}</span>
                            </div>
                            <span className="text-sm">{product.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{15 - index * 3} views</div>
                            <div className="text-xs text-gray-500">{5 - index} inquiries</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">New customer inquiry</span>
                          <div className="text-gray-500">2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Product view spike</span>
                          <div className="text-gray-500">4 hours ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Ad campaign performance</span>
                          <div className="text-gray-500">1 day ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <PremiumFeatureBlock
              title="Advanced Analytics Dashboard"
              description="Get detailed insights into your business performance, customer demographics, revenue analytics, and more with Premium."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          initialData={editingProduct || undefined}
        />
      )}

      {/* Ad Creation/Edit Dialog */}
      <AdCreationDialog
        open={showAdDialog}
        onClose={() => {
          setShowAdDialog(false);
          setEditingAd(null);
        }}
        onSubmit={editingAd ? handleUpdateAd : handleCreateAd}
        initialData={editingAd || undefined}
      />
    </div>
  );
}

function BusinessProfileForm({ onSubmit }: { onSubmit: (data: Partial<BusinessProfile>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Food & Beverage',
    location: 'Downtown District',
    contactEmail: '',
    contactPhone: ''
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-6 w-6" />
            <span>Create Your Business Profile</span>
          </CardTitle>
          <CardDescription>
            Set up your business profile to start selling on ShopHood
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <Label htmlFor="type">Business Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your business..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="business@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+1-555-0123"
              />
            </div>
          </div>

          <Button 
            onClick={() => onSubmit(formData)}
            className="w-full bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
            disabled={!formData.name || !formData.description}
          >
            Create Business Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: { 
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
  initialData?: Product;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || 'Services',
    availability: initialData?.availability ?? true
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-price">Price ($)</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="product-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              checked={formData.availability}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availability: checked }))}
            />
            <Label>Available for purchase</Label>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={() => onSubmit(formData)}
              className="flex-1 bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
              disabled={!formData.name || !formData.description || formData.price <= 0}
            >
              {initialData ? 'Update Product' : 'Add Product'}
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
