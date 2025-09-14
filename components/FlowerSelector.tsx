
import React from 'react';

interface FlowerSelectorProps {
  premadeFlowers: { id: string; src: string }[];
  onSelectFlower: (src: string) => void;
  selectedFlower: string | null;
}

export const FlowerSelector: React.FC<FlowerSelectorProps> = ({ premadeFlowers, onSelectFlower, selectedFlower }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center py-4">
      {premadeFlowers.map((flower) => {
        const isSelected = selectedFlower === flower.src;
        return (
          <button
            key={flower.id}
            onClick={() => onSelectFlower(flower.src)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2 transition-all transform hover:scale-110 focus:outline-none ${isSelected ? 'ring-2 ring-black bg-[#E4DDD1]' : 'ring-2 ring-transparent hover:bg-[#E4DDD1]'}`}
            aria-label={`Select ${flower.id}`}
            aria-pressed={isSelected}
          >
            <img 
              src={flower.src} 
              alt={flower.id}
              className="w-full h-full object-contain"
            />
          </button>
        );
      })}
    </div>
  );
};