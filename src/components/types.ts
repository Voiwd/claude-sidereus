export interface PlanetProps {
  position: [number, number, number];
  texture: string;
  name: string;
  radius: number;
  texture2?: string;
  isFocused?: boolean;
  onClick?: () => void;
}
