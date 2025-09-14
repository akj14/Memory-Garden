export interface FlowerPosition {
  x: number;
  y: number;
}

export interface FlowerType {
  id: string;
  imageSrc: string;
  memory: string;
  position: FlowerPosition;
  hasBeenMoved?: boolean;
}