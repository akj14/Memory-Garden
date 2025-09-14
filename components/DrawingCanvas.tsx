import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  onDrawEnd: (base64: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastWidthRef = useRef(5);
  const [color, setColor] = useState('#000000');
  
  // Brush dynamics
  const MIN_BRUSH_WIDTH = 1;
  const MAX_BRUSH_WIDTH = 15;
  const VELOCITY_FILTER_WEIGHT = 0.6;

  const getCanvasPoint = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };
  
  // Effect to handle canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        // This is a device pixel ratio fix for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Re-apply settings after resize
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    });

    observer.observe(canvas);

    return () => {
        observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const currentPoint = getCanvasPoint(e);
      if (!currentPoint) return;
      
      lastPointRef.current = currentPoint;
      lastWidthRef.current = MAX_BRUSH_WIDTH / 1.5;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const currentPoint = getCanvasPoint(e);
      const lastPoint = lastPointRef.current;

      if (!currentPoint || !lastPoint) return;
      
      const distance = Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);
      
      const targetWidth = Math.max(MAX_BRUSH_WIDTH - distance * 1.5, MIN_BRUSH_WIDTH);
      const newWidth = lastWidthRef.current * VELOCITY_FILTER_WEIGHT + targetWidth * (1 - VELOCITY_FILTER_WEIGHT);
      
      ctx.strokeStyle = color;
      ctx.lineWidth = newWidth;

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      
      lastPointRef.current = currentPoint;
      lastWidthRef.current = newWidth;

      if (e.cancelable) e.preventDefault();
    };

    const handleEnd = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      onDrawEnd(canvas.toDataURL());
    };
    
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [color, onDrawEnd]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // We need to account for the DPR scaling
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        onDrawEnd('');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <canvas
        ref={canvasRef}
        className="border-2 border-black border-opacity-20 rounded-lg bg-white cursor-crosshair touch-none w-full max-w-[300px] aspect-square"
      />
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <label htmlFor="color-picker" className="text-sm font-semibold text-black">
          Color
        </label>
        <div className="relative w-10 h-10 rounded-full border-2 border-black border-opacity-10 overflow-hidden">
           <input
              type="color"
              id="color-picker"
              aria-label="Choose a color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
           />
           <div 
              className="w-full h-full" 
              style={{ backgroundColor: color }}
              aria-hidden="true"
           ></div>
        </div>
        <button 
          onClick={clearCanvas} 
          className="bg-transparent text-black text-sm font-semibold px-4 py-2 rounded-lg border border-black hover:bg-black hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};