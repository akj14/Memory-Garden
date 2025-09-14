import React, { useRef, useState, useCallback } from 'react';
import type { FlowerType, FlowerPosition } from '../types.ts';

interface FlowerProps {
  flower: FlowerType;
  onUpdatePosition: (id: string, position: FlowerPosition) => void;
  isDraggable: boolean;
}

export const Flower: React.FC<FlowerProps> = ({ flower, onUpdatePosition, isDraggable }) => {
  const flowerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstruction, setShowInstruction] = useState(isDraggable);
  const [animationDelay] = useState(() => `-${(Math.random() * 10).toFixed(2)}s`);

  const dragInfo = useRef({ offsetX: 0, offsetY: 0 });

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!flowerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const gardenEl = flowerRef.current.parentElement;
    if (!gardenEl) return;
    const gardenRect = gardenEl.getBoundingClientRect();

    let newX = clientX - gardenRect.left - dragInfo.current.offsetX;
    let newY = clientY - gardenRect.top - dragInfo.current.offsetY;

    const flowerWidth = flowerRef.current.offsetWidth;
    const flowerHeight = flowerRef.current.offsetHeight;
    newX = Math.max(0, Math.min(newX, gardenRect.width - flowerWidth));
    newY = Math.max(0, Math.min(newY, gardenRect.height - flowerHeight));

    const newXPercent = (newX / gardenRect.width) * 100;
    const newYPercent = (newY / gardenRect.height) * 100;

    flowerRef.current.style.left = `${newXPercent}%`;
    flowerRef.current.style.top = `${newYPercent}%`;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleDragMove(e);
  }, [handleDragMove]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleDragEnd);

    if (flowerRef.current) {
      const newX = parseFloat(flowerRef.current.style.left);
      const newY = parseFloat(flowerRef.current.style.top);
      onUpdatePosition(flower.id, { x: newX, y: newY });
    }
  }, [flower.id, onUpdatePosition, handleDragMove, handleTouchMove]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!flowerRef.current) return;
    
    setShowInstruction(false); // Hide instruction on drag
    setIsDragging(true);

    const flowerRect = flowerRef.current.getBoundingClientRect();
    dragInfo.current = {
      offsetX: clientX - flowerRect.left,
      offsetY: clientY - flowerRect.top,
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }, [handleDragEnd, handleDragMove, handleTouchMove]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  return (
    <div
      ref={flowerRef}
      onMouseDown={isDraggable ? handleMouseDown : undefined}
      onTouchStart={isDraggable ? handleTouchStart : undefined}
      className={`absolute group w-24 h-24 sm:w-32 sm:h-32 ${isDragging ? 'z-20 cursor-grabbing shadow-xl' : (isDraggable ? 'cursor-grab' : '')}`}
      style={{
        left: `${flower.position.x}%`,
        top: `${flower.position.y}%`,
        touchAction: 'none',
      }}
    >
      {/* This inner div handles animations for the flower image only */}
      <div 
        className={`w-full h-full transform origin-bottom transition-transform duration-300 group-hover:scale-110 animate-sway ${isDragging ? 'scale-110 !animate-none' : ''}`}
        style={{ animationDelay }}
      >
        <img src={flower.imageSrc} alt="A user's flower" className="w-full h-full object-contain pointer-events-none" />
      </div>

      {showInstruction && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 bg-white bg-opacity-90 rounded-lg shadow-2xl pointer-events-none animate-pulse">
            <p className="text-gray-600 text-sm text-center">
              Plant your flower wherever you feel it belongs.
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white border-opacity-90"></div>
        </div>
      )}
      
      {/* This tooltip is a child of the stationary outer container */}
      <div className={`absolute bottom-full mb-3 w-56 sm:w-64 p-4 bg-white bg-opacity-90 rounded-lg shadow-2xl 
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        transition-all duration-300
        pointer-events-none left-1/2 -translate-x-1/2 ${isDragging || showInstruction ? '!opacity-0' : ''}`}>
        <p className="text-black text-sm italic">"{flower.memory}"</p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white border-opacity-90"></div>
      </div>
    </div>
  );
};