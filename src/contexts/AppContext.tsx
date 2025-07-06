
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, BusinessProfile, Product, Message, AdSlot } from '../types';

type AppAction = 
  | { type: 'LOGIN_USER'; payload: User }
  | { type: 'LOGOUT_USER' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_BUSINESS_PROFILE'; payload: BusinessProfile }
  | { type: 'UPDATE_BUSINESS_PROFILE'; payload: BusinessProfile }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'ADD_AD_SLOT'; payload: AdSlot }
  | { type: 'UPDATE_AD_SLOT'; payload: AdSlot }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  users: [],
  businessProfiles: [],
  products: [],
  messages: [],
  adSlots: [],
  currentUser: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT_USER':
      return { ...state, currentUser: null };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    case 'ADD_BUSINESS_PROFILE':
      return { ...state, businessProfiles: [...state.businessProfiles, action.payload] };
    case 'UPDATE_BUSINESS_PROFILE':
      return {
        ...state,
        businessProfiles: state.businessProfiles.map(profile =>
          profile.id === action.payload.id ? action.payload : profile
        )
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'MARK_MESSAGE_READ':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload ? { ...message, read: true } : message
        )
      };
    case 'ADD_AD_SLOT':
      return { ...state, adSlots: [...state.adSlots, action.payload] };
    case 'UPDATE_AD_SLOT':
      return {
        ...state,
        adSlots: state.adSlots.map(ad =>
          ad.id === action.payload.id ? action.payload : ad
        )
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('shophood-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.messages = parsedState.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
        initializeData();
      }
    } else {
      initializeData();
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shophood-state', JSON.stringify(state));
  }, [state]);

  const initializeData = () => {
    // Initialize with sample data
    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Consumer',
        role: 'consumer',
        email: 'john@example.com',
        password: 'password',
        subscriptionPlan: 'free',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        id: '2',
        name: 'Sarah\'s Bakery',
        role: 'business',
        email: 'sarah@bakery.com',
        password: 'password',
        subscriptionPlan: 'free',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        id: '3',
        name: 'Mike\'s Electronics',
        role: 'business',
        email: 'mike@electronics.com',
        password: 'password',
        subscriptionPlan: 'premium',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
      }
    ];

    const sampleProfiles: BusinessProfile[] = [
      {
        id: 'bp1',
        ownerUserId: '2',
        name: 'Sarah\'s Artisan Bakery',
        description: 'Fresh baked goods made daily with locally sourced ingredients.',
        type: 'Food & Beverage',
        location: 'Downtown District',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        contactEmail: 'sarah@bakery.com',
        contactPhone: '+1-555-0123',
        images: ['https://images.unsplash.com/photo-1555507036-ab794f27d0ac?w=400'],
        rating: 4.8,
        reviewCount: 127
      },
      {
        id: 'bp2', 
        ownerUserId: '3',
        name: 'Mike\'s Tech Hub',
        description: 'Latest electronics and gadgets with expert repair services.',
        type: 'Electronics',
        location: 'Tech Quarter',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        contactEmail: 'mike@electronics.com',
        contactPhone: '+1-555-0456',
        images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
        rating: 4.6,
        reviewCount: 89
      }
    ];

    const sampleProducts: Product[] = [
      {
        id: 'p1',
        businessId: 'bp1',
        name: 'Artisan Sourdough Bread',
        description: 'Traditional sourdough with 24-hour fermentation process.',
        price: 8.99,
        availability: true,
        category: 'Food & Beverage',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300'
      },
      {
        id: 'p2',
        businessId: 'bp1',
        name: 'Chocolate Croissants',
        description: 'Buttery croissants filled with Belgian dark chocolate.',
        price: 3.50,
        availability: true,
        category: 'Food & Beverage',
        image: 'https://images.unsplash.com/photo-1555507036-ab794f27d0ac?w=300'
      },
      {
        id: 'p3',
        businessId: 'bp2',
        name: 'Wireless Earbuds Pro',
        description: 'Premium noise-canceling wireless earbuds with 30-hour battery.',
        price: 199.99,
        availability: true,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300'
      },
      {
        id: 'p4',
        businessId: 'bp2',
        name: 'Smart Watch Series X',
        description: 'Advanced fitness tracking with health monitoring features.',
        price: 299.99,
        availability: true,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
      },
      {
        id: 'p5',
        businessId: 'bp1',
        name: 'Fresh Coffee Blend',
        description: 'Locally roasted premium coffee beans.',
        price: 12.99,
        availability: true,
        category: 'Food & Beverage',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300'
      },
      {
        id: 'p6',
        businessId: 'bp2',
        name: 'Bluetooth Speaker',
        description: 'Portable wireless speaker with crystal clear sound.',
        price: 89.99,
        availability: true,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300'
      }
    ];

    const sampleAds: AdSlot[] = [
      {
        id: 'ad1',
        businessId: 'bp2',
        type: 'sponsored',
        active: true,
        bidAmount: 25.00,
        title: 'Premium Electronics',
        description: 'Get the latest tech at unbeatable prices!'
      }
    ];

    const sampleMessages: Message[] = [
      {
        id: 'm1',
        fromUserId: '1',
        toUserId: '2',
        content: 'Hi! Do you have any fresh croissants available today?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: 'm2',
        fromUserId: '2',
        toUserId: '1',
        content: 'Yes! We just baked a fresh batch this morning. They\'re still warm!',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        read: true
      },
      {
        id: 'm3',
        fromUserId: '1',
        toUserId: '2',
        content: 'Perfect! I\'ll stop by in 30 minutes. Can you set aside 4 chocolate croissants?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: false
      },
      {
        id: 'm4',
        fromUserId: '3',
        toUserId: '1',
        content: 'Thank you for your interest in our wireless earbuds! They\'re currently 20% off.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false
      }
    ];

    dispatch({ type: 'LOAD_STATE', payload: {
      users: sampleUsers,
      businessProfiles: sampleProfiles,
      products: sampleProducts,
      messages: sampleMessages,
      adSlots: sampleAds,
      currentUser: null
    }});
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
