import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { Restaurant, Coordinates } from '../types';
import { searchRestaurants, getMockData } from '../services/geminiService';
import { Badge } from '../components/Shared';

interface SearchScreenProps {
  onNavigate: (screen: any, data?: any) => void;
  userLocation: Coordinates | null;
}

const POPULAR_SEARCHES = ["Ćevapi", "Pizza", "Sushi", "Kafa", "Burgeri"];

const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate, userLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setQuery(searchTerm);
    setIsSearching(true);
    setHasSearched(true);

    const data = await searchRestaurants(searchTerm, userLocation);
    setResults(data);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300 min-h-screen">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-b-[2rem] shadow-sm sticky top-0 z-20 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pretraga</h1>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
            <input
              type="text"
              autoFocus
              placeholder="Šta vam se jede danas?"
              className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-none focus:ring-2 focus:ring-orange-400 outline-none text-gray-800 dark:text-white font-medium transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 transition-transform">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {!hasSearched ? (
          /* Initial State */
          <div className="animate-slide-up">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Popularno</h3>
            <div className="flex flex-wrap gap-3">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-medium shadow-sm hover:border-orange-200 dark:hover:border-orange-900/50 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-800 dark:text-white mt-8 mb-4">Nedavne pretrage</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors" onClick={() => handleSearch("Italijanska hrana")}>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"><HistoryIcon size={16} /></div>
                <span>Italijanska hrana</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors" onClick={() => handleSearch("Najbolji ćevapi")}>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"><HistoryIcon size={16} /></div>
                <span>Najbolji ćevapi</span>
              </div>
            </div>
          </div>
        ) : (
          /* Results State */
          <div className="space-y-4 animate-slide-up">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">
              {isSearching ? "Pretraživanje..." : `Rezultati za "${query}" (${results.length})`}
            </h3>

            {isSearching ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length > 0 ? (
              results.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => onNavigate('detail', restaurant)}
                  className="bg-white dark:bg-gray-800 p-3 rounded-[2rem] shadow-sm active:scale-[0.98] transition-all cursor-pointer flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-1 pr-2">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 text-orange-500 font-bold text-xs bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                        <Star size={12} fill="currentColor" />
                        {restaurant.rating}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin size={12} />
                      {restaurant.address}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-60">
                <Search size={48} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">Nismo pronašli rezultate.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /><path d="M12 7v5l4 2" /></svg>
);

export default SearchScreen;