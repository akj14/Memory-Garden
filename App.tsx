import React, { useState, useEffect } from 'react';
import { Garden } from './components/Garden';
import { CreationModal } from './components/CreationModal';
import { INITIAL_FLOWERS, PREMADE_FLOWERS } from './constants';
import type { FlowerType, FlowerPosition } from './types';

// Prepare initial flowers data by resolving image sources
const initialFlowersData: FlowerType[] = INITIAL_FLOWERS.map((f, index) => {
  const premade = PREMADE_FLOWERS.find(p => p.id === f.id);
  // Fallback to a default flower if not found.
  const imageSrc = premade ? premade.src : PREMADE_FLOWERS[0].src;
  return {
    id: `initial-${index}-${f.id}`,
    memory: f.memory,
    position: f.position,
    imageSrc: imageSrc,
    hasBeenMoved: true, // Initial flowers are not movable
  };
});

const LOCAL_STORAGE_KEY = 'memoryGardenFlowers';

function App() {
  const [flowers, setFlowers] = useState<FlowerType[]>(() => {
    try {
      const savedFlowers = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedFlowers) {
        return JSON.parse(savedFlowers);
      }
    } catch (error) {
      console.error('Error reading flowers from localStorage', error);
    }
    return initialFlowersData;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justPlantedId, setJustPlantedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flowers));
    } catch (error) {
      console.error('Error saving flowers to localStorage', error);
    }
  }, [flowers]);

  const handlePlantFlower = (imageSrc: string, memory: string) => {
    const newFlower: FlowerType = {
      id: new Date().toISOString(), // Unique ID
      imageSrc,
      memory,
      position: {
        // Random position, avoiding edges
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 70) + 15,
      },
      hasBeenMoved: false,
    };

    setFlowers(prevFlowers => [...prevFlowers, newFlower]);
    setJustPlantedId(newFlower.id);
    setIsModalOpen(false); // Close modal after planting
  };

  const handleUpdateFlowerPosition = (id: string, newPosition: FlowerPosition) => {
    setFlowers(prevFlowers =>
      prevFlowers.map(flower =>
        flower.id === id ? { ...flower, position: newPosition, hasBeenMoved: true } : flower
      )
    );
    if (id === justPlantedId) {
      setJustPlantedId(null); // Lock the flower after its first move
    }
  };

  return (
    <div className="h-screen w-screen bg-[#EDE8DE] flex flex-col p-4 sm:p-8">
      <div className="w-full flex justify-between items-center mb-4 sm:mb-8">
        <p className="text-black italic text-sm sm:text-base">
          Touch a flower, and the story it carries will appear.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent text-black font-semibold py-2 px-5 rounded-full border border-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-all transform hover:scale-105"
        >
          + Plant a Memory
        </button>
      </div>
      
      <main className="flex-grow relative">
        <Garden flowers={flowers} onUpdateFlowerPosition={handleUpdateFlowerPosition} justPlantedId={justPlantedId} />
      </main>

      {isModalOpen && (
        <CreationModal 
          onClose={() => setIsModalOpen(false)}
          onPlant={handlePlantFlower}
        />
      )}
    </div>
  );
}

export default App;
