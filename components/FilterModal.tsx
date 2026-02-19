import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Shared';

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState(1);
  const cuisines = ["Bosanska kuhinja", "Italijanska kuhinja", "Fast food", "Kafić", "Azijska kuhinja", "Meksička kuhinja"];
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Italijanska kuhinja"]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine) 
        : [...prev, cuisine]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto sm:rounded-[2rem] rounded-t-[2.5rem] p-6 flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} className="opacity-0" /> {/* Spacer */}
            </button>
            <h2 className="text-xl font-bold text-gray-800">Odaberi filtere</h2>
            <button onClick={onClose} className="p-2 bg-orange-100 rounded-full text-orange-500 hover:bg-orange-200 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 px-1">
            {/* Cuisine Type */}
            <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tip kuhinje</h3>
                <div className="space-y-3">
                    {cuisines.map((cuisine) => (
                        <label key={cuisine} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedCuisines.includes(cuisine) ? 'bg-orange-500 border-orange-500' : 'border-gray-300 group-hover:border-orange-300'}`}>
                                {selectedCuisines.includes(cuisine) && <span className="text-white text-xs">✓</span>}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={selectedCuisines.includes(cuisine)}
                                onChange={() => toggleCuisine(cuisine)}
                            />
                            <span className={`${selectedCuisines.includes(cuisine) ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{cuisine}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Price Range */}
            <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Raspon cijena</h3>
                <div className="bg-orange-50 p-6 rounded-2xl">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span>Jeftino</span>
                        <span>Luksuzno</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="1"
                        value={priceRange} 
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between mt-2">
                        <span className={`text-xs ${priceRange === 1 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>$</span>
                        <span className={`text-xs ${priceRange === 2 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>$$</span>
                        <span className={`text-xs ${priceRange === 3 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>$$$</span>
                    </div>
                </div>
            </section>
        </div>

        <div className="mt-8">
            <Button variant="secondary" onClick={() => onApply({ cuisines: selectedCuisines, price: priceRange })}>
                Prikaži rezultate
            </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
