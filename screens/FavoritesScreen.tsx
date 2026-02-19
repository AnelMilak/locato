import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { Restaurant } from '../types';
import { Badge } from '../components/Shared';

interface FavoritesScreenProps {
  onNavigate: (screen: any, data?: any) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onNavigate }) => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  useEffect(() => {
    // Fetch favorites from local storage
    const storedFavs = JSON.parse(localStorage.getItem('locato_favorites') || '[]');
    setFavorites(storedFavs);
  }, []);

  const removeFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favorites.filter(item => item.id !== id);
    setFavorites(newFavs);
    localStorage.setItem('locato_favorites', JSON.stringify(newFavs));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[2rem] shadow-sm mb-4 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Omiljeni</h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">Sačuvani restorani i mjesta</p>
      </div>

      <div className="px-6 space-y-4">
        {favorites.length > 0 ? (
          favorites.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onNavigate('detail', restaurant)}
              className="bg-white dark:bg-gray-800 p-3 rounded-[2rem] shadow-sm active:scale-[0.98] transition-all cursor-pointer relative group"
            >
              <div className="relative h-40 rounded-[1.5rem] overflow-hidden mb-3">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <MapPin size={12} /> {restaurant.address}
                  </div>
                </div>
              </div>

              <div className="px-2 flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">{restaurant.cuisine}</Badge>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                    <Star size={12} className="text-orange-400" fill="currentColor" />
                    {restaurant.rating}
                  </div>
                </div>
                <button
                  onClick={(e) => removeFavorite(e, restaurant.id)}
                  className="p-2 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 mb-4 transition-colors">
              <Heart size={32} />
            </div>
            <h3 className="text-gray-800 dark:text-white font-bold mb-1">Nema omiljenih</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm max-w-[200px]">Označite restorane srcem da bi se pojavili ovdje.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;