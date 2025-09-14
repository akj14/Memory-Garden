import React from 'react';

interface MemoryInputProps {
  memory: string;
  setMemory: (memory: string) => void;
}

export const MemoryInput: React.FC<MemoryInputProps> = ({ memory, setMemory }) => {
  return (
    <div className="w-full">
      <label htmlFor="memory" className="block text-sm font-medium text-black mb-2">
        Write a memory for your flower:
      </label>
      <textarea
        id="memory"
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        rows={4}
        className="w-full p-3 border border-black border-opacity-20 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition bg-[#E4DDD1] placeholder:text-black placeholder:opacity-60 text-black"
        placeholder="e.g., A sunny afternoon spent reading in the park..."
      />
    </div>
  );
};