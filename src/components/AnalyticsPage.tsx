import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  MessageCircle,
  Award,
  ShoppingBag,
  Target,
  Calendar
} from 'lucide-react';
import { PremiumFeatureBlock } from './PremiumFeatureBlock';

export function AnalyticsPage() {
  const { state } = useApp();
  const currentUser = state.currentUser!;
  const businessProfile = state.businessProfiles.find(bp => bp.ownerUserId === currentUser.id);
  const businessProducts = state.products.filter(p => p.businessId === businessProfile?.id);
  const businessAds = state.adSlots.filter(ad => ad.businessId === businessProfile?.id);

  if (currentUser.subscriptionPlan !== 'premium') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Get detailed insights into your business performance</p>
        </div>
        
        <PremiumFeatureBlock
          title="Advanced Analytics Dashboard"
          description="Get detailed insights into your business performance, customer demographics, revenue analytics, conversion rates, and more with Premium. Track your growth and make data-driven decisions."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive insights for {businessProfile?.name}</p>
        </div>
        <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
          Premium Analytics
        </Badge>
      </div>

      {/* Key Metrics */}
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
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Revenue Breakdown</span>
            </CardTitle>
            <CardDescription>Performance by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{product.name}</span>
                  <div className="text-right">
                    <div className="font-bold text-green-600">${(product.price * (5 - index)).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{5 - index} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Customer Demographics</span>
            </CardTitle>
            <CardDescription>Age distribution of your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Age 25-34</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-[42%] h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm">42%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Age 35-44</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-[28%] h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm">28%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Age 18-24</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-[20%] h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm">20%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Age 45+</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div className="w-[10%] h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Popular Products</span>
            </CardTitle>
            <CardDescription>Most viewed and inquired products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businessProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-shophood-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-shophood-600">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium">{product.name}</span>
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
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Advertising Performance</span>
            </CardTitle>
            <CardDescription>ROI and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessAds.length > 0 ? (
                businessAds.map((ad, index) => (
                  <div key={ad.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{ad.title}</h4>
                      <Badge variant={ad.active ? 'default' : 'secondary'}>
                        {ad.active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-500">Impressions</div>
                        <div className="font-medium">{1250 - index * 200}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Clicks</div>
                        <div className="font-medium">{89 - index * 15}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">CTR</div>
                        <div className="font-medium text-green-600">{(7.1 - index * 0.5).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Spend</div>
                        <div className="font-medium">${ad.bidAmount * 30}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No active advertising campaigns</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity Timeline</span>
          </CardTitle>
          <CardDescription>Track your business activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">New customer inquiry received</h4>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-xs text-gray-600">Customer interested in your latest product</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Profile view spike detected</h4>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                <p className="text-xs text-gray-600">47% increase in profile views today</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Advertisement campaign performing well</h4>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-xs text-gray-600">CTR improved by 15% compared to last week</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}