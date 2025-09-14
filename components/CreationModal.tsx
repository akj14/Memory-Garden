
import React, { useState } from 'react';
import { FlowerSelector } from './FlowerSelector';
import { DrawingCanvas } from './DrawingCanvas';
import { MemoryInput } from './MemoryInput';
import { PREMADE_FLOWERS } from '../constants';

interface CreationModalProps {
  onClose: () => void;
  onPlant: (imageSrc: string, memory: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all focus:outline-none border-b-2 ${
      active ? 'text-black border-black' : 'text-black opacity-60 border-transparent hover:opacity-100'
    }`}
  >
    {children}
  </button>
);

export const CreationModal: React.FC<CreationModalProps> = ({ onClose, onPlant }) => {
  const [memory, setMemory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'choose' | 'draw'>('choose');

  const handleSelectPremade = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  
  const handleDrawEnd = (base64: string) => {
    if (base64) setSelectedImage(base64);
    else setSelectedImage(null);
  };

  const handlePlant = () => {
    if (selectedImage && memory) {
      onPlant(selectedImage, memory);
    } else {
      alert('Please choose or create a flower and write a memory.');
    }
  };
  
  const isPlantable = selectedImage && memory.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#FFFBF3] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 sm:p-6 border-b border-black border-opacity-10">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Plant a New Memory</h2>
          <button onClick={onClose} className="text-black opacity-50 hover:opacity-100 transition-opacity text-3xl leading-none">&times;</button>
        </header>
        
        <main className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">1. Create your flower</h3>
              <div className="border-b border-black border-opacity-10">
                <nav className="-mb-px flex space-x-1" aria-label="Tabs">
                  <TabButton active={activeTab === 'choose'} onClick={() => { setActiveTab('choose'); setSelectedImage(null); }}>Choose</TabButton>
                  <TabButton active={activeTab === 'draw'} onClick={() => { setActiveTab('draw'); setSelectedImage(null); }}>Draw</TabButton>
                </nav>
              </div>
              <div className="pt-4 flex items-center justify-center">
                {activeTab === 'choose' && (
                  <FlowerSelector 
                    premadeFlowers={PREMADE_FLOWERS} 
                    onSelectFlower={handleSelectPremade}
                    selectedFlower={selectedImage}
                  />
                )}
                {activeTab === 'draw' && <DrawingCanvas onDrawEnd={handleDrawEnd} />}
              </div>
            </div>
            
            <hr className="border-black border-opacity-10" />
            
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">2. Add your memory</h3>
              <MemoryInput 
                memory={memory} 
                setMemory={setMemory}
              />
            </div>
          </div>
        </main>
        
        <footer className="p-4 sm:p-6 border-t border-black border-opacity-10 rounded-b-2xl">
          <button
            onClick={handlePlant}
            disabled={!isPlantable}
            className="w-full bg-black text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
          >
            Plant in Garden
          </button>
        </footer>
      </div>
    </div>
  );
};