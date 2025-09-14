import React from 'react';
import { Flower } from './Flower';
import type { FlowerType, FlowerPosition } from '../types';

interface GardenProps {
  flowers: FlowerType[];
  onUpdateFlowerPosition: (id: string, position: FlowerPosition) => void;
  justPlantedId: string | null;
}

export const Garden: React.FC<GardenProps> = ({ flowers, onUpdateFlowerPosition, justPlantedId }) => {
  return (
    <div className="relative w-full h-full">
      {flowers.map(flower => (
        <Flower 
          key={flower.id} 
          flower={flower} 
          onUpdatePosition={onUpdateFlowerPosition} 
          isDraggable={flower.id === justPlantedId}
        />
      ))}
    </div>
  );
};