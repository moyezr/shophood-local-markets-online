
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
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

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
    toast({
      title: 'Product added!',
      description: 'Your product is now available to customers.',
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
          {currentUser.subscriptionPlan === 'premium' && (
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          )}
        </TabsList>

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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {currentUser.subscriptionPlan === 'free' && businessProducts.length >= 3 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Upgrade to add more products</h3>
                    <p className="text-sm text-yellow-700">Free accounts are limited to 3 products. Upgrade to Premium for unlimited listings.</p>
                  </div>
                  <Button onClick={handleUpgradeToPremium} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advertising" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Advertising Campaigns</h2>
            <Button 
              onClick={() => handleCreateAd({ type: 'sponsored', bidAmount: 25 })}
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      {ad.active ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {currentUser.subscriptionPlan === 'premium' && (
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">$2,547</div>
                  <p className="text-sm text-gray-600">This month</p>
                  <div className="mt-4 h-32 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-end justify-center">
                    <div className="text-sm text-green-700">Sample chart data</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Views</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages Received</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-medium">7.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          onSubmit={handleCreateProduct}
          onCancel={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
}

// Separate components for forms
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
