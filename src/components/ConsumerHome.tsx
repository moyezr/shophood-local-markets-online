
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { SearchFilters, Product, BusinessProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Crown,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOCATIONS = [
  'Downtown District',
  'Tech Quarter', 
  'Shopping Center',
  'Historic District',
  'Business Park'
];

const CATEGORIES = [
  'All Categories',
  'Food & Beverage',
  'Electronics',
  'Fashion',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Recreation',
  'Automotive',
  'Services'
];

export function ConsumerHome() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    location: 'Downtown District',
    radius: 10,
    category: 'All Categories',
    priceRange: [0, 500],
    minRating: 0
  });
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const handleGetLocation = async () => {
    setIsRequestingLocation(true);
    
    // Simulate GPS location request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      
      // Spoof location with random coordinates near the business locations
      const spoofedLocations = [
        { lat: 40.7128, lng: -74.0060, name: 'Downtown District' },
        { lat: 40.7589, lng: -73.9851, name: 'Tech Quarter' },
        { lat: 40.7505, lng: -73.9934, name: 'Shopping Center' },
        { lat: 40.7355, lng: -74.0010, name: 'Historic District' }
      ];
      
      const randomLocation = spoofedLocations[Math.floor(Math.random() * spoofedLocations.length)];
      
      setFilters(prev => ({ 
        ...prev, 
        userLocation: randomLocation,
        useGpsLocation: true,
        location: randomLocation.name
      }));
      
      toast({
        title: 'Location found!',
        description: `Using your current location in ${randomLocation.name}`,
      });
    } catch (error) {
      toast({
        title: 'Location access denied',
        description: 'Please select a location manually.',
        variant: 'destructive'
      });
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const calculateDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredResults = useMemo(() => {
    let products = state.products.filter(product => product.availability);
    
    // Filter by search query
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== 'All Categories') {
      products = products.filter(product => product.category === filters.category);
    }

    // Filter by price range
    products = products.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Get business profiles for location and rating filtering
    const businessProfiles = state.businessProfiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, BusinessProfile>);

    // Filter by location - use GPS if available, otherwise use selected location
    if (filters.useGpsLocation && filters.userLocation) {
      // GPS-based filtering by radius
      products = products.filter(product => {
        const business = businessProfiles[product.businessId];
        if (!business) return false;
        const distance = calculateDistance(filters.userLocation!, business.coordinates);
        return distance <= filters.radius;
      });
    } else {
      // Traditional location filtering
      products = products.filter(product => {
        const business = businessProfiles[product.businessId];
        return business && business.location === filters.location;
      });
    }

    // Filter by minimum rating
    products = products.filter(product => {
      const business = businessProfiles[product.businessId];
      return business && business.rating >= filters.minRating;
    });

    // Sort sponsored products first
    const sponsoredBusinessIds = state.adSlots
      .filter(ad => ad.active && ad.type === 'sponsored')
      .map(ad => ad.businessId);

    const sponsoredProducts = products.filter(product => 
      sponsoredBusinessIds.includes(product.businessId)
    );
    const regularProducts = products.filter(product => 
      !sponsoredBusinessIds.includes(product.businessId)
    );

    return [...sponsoredProducts, ...regularProducts];
  }, [state.products, state.businessProfiles, state.adSlots, searchQuery, filters]);

  const getBusinessForProduct = (product: Product) => {
    return state.businessProfiles.find(bp => bp.id === product.businessId);
  };

  const isSponsored = (product: Product) => {
    return state.adSlots.some(ad => 
      ad.active && ad.type === 'sponsored' && ad.businessId === product.businessId
    );
  };

  const handleContactBusiness = (business: BusinessProfile) => {
    // Find the business owner user
    const businessOwner = state.users.find(user => user.id === business.ownerUserId);
    if (!businessOwner) return;

    // Create an initial message if no conversation exists
    const existingMessages = state.messages.filter(
      msg => (msg.fromUserId === state.currentUser!.id && msg.toUserId === businessOwner.id) ||
             (msg.fromUserId === businessOwner.id && msg.toUserId === state.currentUser!.id)
    );

    if (existingMessages.length === 0) {
      const newMessage = {
        id: Date.now().toString(),
        fromUserId: state.currentUser!.id,
        toUserId: businessOwner.id,
        content: `Hi! I'm interested in your products at ${business.name}. Could you tell me more?`,
        timestamp: new Date(),
        read: false
      };
      
      // Add the message using dispatch
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    }

    toast({
      title: 'Message sent!',
      description: `Started conversation with ${business.name}. Check your messages.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12 bg-gradient-to-r from-shophood-50 to-shophood-100 rounded-2xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Discover Local Businesses
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find amazing products and services from businesses in your neighborhood
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <Input
                id="search"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label>Location</Label>
              <div className="flex gap-2 mt-1">
                <Select 
                  value={filters.location} 
                  onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, location: value, useGpsLocation: false }))
                  }
                  disabled={filters.useGpsLocation}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={filters.useGpsLocation ? "default" : "outline"}
                  onClick={handleGetLocation}
                  disabled={isRequestingLocation}
                  className="px-3"
                >
                  <Navigation className={`h-4 w-4 ${isRequestingLocation ? 'animate-pulse' : ''}`} />
                </Button>
              </div>
              {filters.useGpsLocation && (
                <p className="text-xs text-green-600 mt-1">Using your current location</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) =>
                setFilters(prev => ({ ...prev, category: value }))
              }>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search Radius: {filters.radius} km</Label>
              <Slider
                value={[filters.radius]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, radius: value[0] }))}
                max={50}
                min={1}
                step={1}
                className="mt-2"
                disabled={!filters.useGpsLocation}
              />
              {!filters.useGpsLocation && (
                <p className="text-xs text-gray-500 mt-1">Enable GPS to use radius filtering</p>
              )}
            </div>
            
            <div>
              <Label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                max={500}
                step={10}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Minimum Rating: {filters.minRating} stars</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Search Results ({filteredResults.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(product => {
            const business = getBusinessForProduct(product);
            const sponsored = isSponsored(product);
            
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {sponsored && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1">
                    <Crown className="inline h-3 w-3 mr-1" />
                    SPONSORED
                  </div>
                )}
                
                {product.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-shophood-600">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {business && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{business.name}</p>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{business.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{business.rating}</span>
                        <span className="text-xs text-gray-500">({business.reviewCount})</span>
                      </div>
                    </div>
                  )}

                  <Badge variant="secondary" className="w-fit">
                    {product.category}
                  </Badge>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
                      onClick={() => business && setSelectedBusiness(business)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Business
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => business && handleContactBusiness(business)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredResults.length === 0 && (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          </Card>
        )}
      </div>

      {/* Business Detail Modal would go here - simplified for demo */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedBusiness.name}</CardTitle>
                  <CardDescription>{selectedBusiness.description}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedBusiness(null)}
                  className="text-gray-500"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{selectedBusiness.rating}</span>
                  <span className="text-gray-500">({selectedBusiness.reviewCount} reviews)</span>
                </div>
                <Badge variant="outline">{selectedBusiness.type}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedBusiness.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedBusiness.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedBusiness.contactPhone}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-shophood-500 to-shophood-600 hover:from-shophood-600 hover:to-shophood-700"
                  onClick={() => handleContactBusiness(selectedBusiness)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
