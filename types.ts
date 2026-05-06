export type ViewState = "lesson" | "game";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SimulationConfig {
  objectMass: number; // kg
  objectVolume: number; // m^3 (simplified unit for UI)
  liquidDensity: number; // kg/m^3
}

export interface GameEntity {
  id: number;
  type: "goldfish" | "shark" | "bubble";
  x: number;
  y: number;
  speed: number;
  scale: number;
}
