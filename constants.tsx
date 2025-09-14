import React from 'react';

// Replace these with the actual paths to your custom flower illustrations.
// It's recommended to use transparent PNGs.
export const PREMADE_FLOWERS: { id: string; src: string }[] = [
  { id: 'flower-1', src: 'https://i.imgur.com/Uwc665H.png' },
  { id: 'flower-2', src: 'https://i.imgur.com/BHaTXF1.png' },
  { id: 'flower-3', src: 'https://i.imgur.com/N4Mr0cN.png' },
  { id: 'flower-4', src: 'https://i.imgur.com/3WXA5YX.png' },
  { id: 'flower-5', src: 'https://i.imgur.com/AXhA5gm.png' },
  { id: 'flower-6', src: 'https://i.imgur.com/xgswlhc.png' },
];

export const INITIAL_FLOWERS: { memory: string; id: string; position: { x: number; y: number } }[] = [
  { memory: "The day we first met, under the cherry blossoms. It felt like a scene from a movie.", id: "flower-1", position: { x: 20, y: 40 } },
  { memory: "Laughing so hard we cried while trying to bake a cake for mom's birthday. It was a disaster, but a happy one.", id: "flower-2", position: { x: 75, y: 60 } },
  { memory: "Watching the sunset from the hilltop, feeling like we were the only two people in the world.", id: "flower-3", position: { x: 50, y: 20 } },
];