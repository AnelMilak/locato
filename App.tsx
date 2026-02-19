import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FilterModal from './components/FilterModal';
import BottomNav from './components/BottomNav';
import { Screen, Restaurant, Coordinates } from './types';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // Initial Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Using default location (Sarajevo)", error);
          // Default to Sarajevo coordinates
          setUserLocation({ latitude: 43.8563, longitude: 18.4131 });
        }
      );
    }
  }, []);

  const navigate = (screen: Screen, data?: any) => {
    if (screen === 'detail' && data) {
      setSelectedRestaurant(data);
    }
    if (screen === 'filter') {
      setShowFilters(true);
      return;
    }
    setCurrentScreen(screen);
  };

  const handleFilterApply = () => {
    setShowFilters(false);
    // Logic to re-fetch would go here, updating state passed to HomeScreen
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'login') {
    return (
      <ThemeProvider>
        <LoginScreen onLogin={() => setCurrentScreen('home')} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="max-w-md mx-auto h-[100dvh] bg-gray-50 dark:bg-gray-900 relative shadow-2xl sm:my-8 sm:rounded-[2.5rem] sm:overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-colors duration-300">

        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-20 bg-gray-50 dark:bg-gray-900">
          {currentScreen === 'home' && (
            <HomeScreen
              onNavigate={navigate}
              userLocation={userLocation}
            />
          )}

          {currentScreen === 'search' && (
            <SearchScreen
              onNavigate={navigate}
              userLocation={userLocation}
            />
          )}

          {currentScreen === 'favorites' && (
            <FavoritesScreen
              onNavigate={navigate}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'detail' && selectedRestaurant && (
            <DetailScreen
              restaurant={selectedRestaurant}
              onBack={() => setCurrentScreen('home')}
            />
          )}
        </main>

        {showFilters && (
          <FilterModal
            onClose={() => setShowFilters(false)}
            onApply={handleFilterApply}
          />
        )}

        {currentScreen !== 'login' && (
          <BottomNav currentScreen={currentScreen} onNavigate={(screen) => screen !== 'filter' && navigate(screen)} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;