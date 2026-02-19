import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, MapPin, Star } from 'lucide-react';
import { Restaurant, Coordinates } from '../types';
import { searchRestaurants, getMockData } from '../services/geminiService';
import { Badge } from '../components/Shared';

interface HomeScreenProps {
  onNavigate: (screen: any, data?: any) => void;
  userLocation: Coordinates | null;
}

const CATEGORIES = ["Sve", "Bosanska", "Italijanska", "Fast food", "Kineska", "Meksička"];

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, userLocation }) => {
  const [activeCategory, setActiveCategory] = useState("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Initial load
  useEffect(() => {
    // Start with mock data for instant "app-like" feel
    setRestaurants(getMockData());
  }, []);

  // Load favorites from local storage whenever component renders/re-mounts
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('locato_favorites') || '[]');
    setFavoriteIds(favs.map((r: Restaurant) => r.id));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    // Use the active category as part of the query if it's not "Sve"
    const query = activeCategory === "Sve" ? (searchQuery || "restaurants") : `${activeCategory} restaurants ${searchQuery}`;

    // In a real app, we would debounce this or trigger on enter.
    // Here we assume this is triggered by category change or explicit effect.
    const results = await searchRestaurants(query, userLocation);
    setRestaurants(results);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, userLocation]);

  return (
    <div className="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header / Search */}
      <div className="flex gap-3 mb-6 sticky top-4 z-20">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pretraži restorane..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-400 outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={() => onNavigate('filter')}
          className="bg-orange-500 text-white p-3 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 transition-transform"
        >
          <SlidersHorizontal size={24} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-none'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Tražim najbolje...</p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onNavigate('detail', restaurant)}
              className="bg-white dark:bg-gray-800 p-3 rounded-[2rem] shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="relative h-48 rounded-[1.5rem] overflow-hidden mb-3">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <button className={`absolute top-3 right-3 backdrop-blur-md p-2 rounded-full transition-colors ${favoriteIds.includes(restaurant.id) ? 'bg-white text-red-500' : 'bg-white/30 text-white hover:bg-white hover:text-red-500'}`}>
                  <Heart size={20} fill={favoriteIds.includes(restaurant.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg text-sm transition-colors">
                    <Star size={14} fill="currentColor" />
                    {restaurant.rating}
                  </div>
                </div>

                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                  <Badge className="bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 px-3 py-1 transition-colors">
                    {restaurant.cuisine}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {restaurant.distance}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;