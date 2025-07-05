
import { useApp } from '../contexts/AppContext';

const Index = () => {
  const { state } = useApp();
  
  // This component is now handled by AppContent in App.tsx
  // It will redirect appropriately based on user state
  return null;
};

export default Index;
