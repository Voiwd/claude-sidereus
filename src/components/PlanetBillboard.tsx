import { Html } from '@react-three/drei';
import { useRef } from 'react';
import type { PointerEvent } from 'react';

interface PlanetBillboardProps {
  label: string;
  radius: number;
  hidden?: boolean;
  onSelect?: () => void;
}

const DRAG_THRESHOLD_PX = 6;
const MIN_DIAMETER_PX = 20;
const MAX_DIAMETER_PX = 35;

export function PlanetBillboard({
  label,
  radius,
  hidden = false,
  onSelect,
}: PlanetBillboardProps) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return;

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    const distance = Math.hypot(deltaX, deltaY);
    pointerStart.current = null;

    if (distance <= DRAG_THRESHOLD_PX) {
      onSelect?.();
    }
  };

  const diameter = Math.min(
    MAX_DIAMETER_PX,
    Math.max(MIN_DIAMETER_PX, radius * 6)
  );

  if (hidden) {
    return null;
  }

  return (
    <Html center position={[0, 0, 0]} zIndexRange={[0, 20]}>
      <button
        aria-label={`Focar em ${label}`}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          pointerStart.current = null;
        }}
        onPointerUp={handlePointerUp}
        style={{
          width: diameter,
          height: diameter,
          border: '2px solid rgba(237, 233, 227, 0.7)',
          borderRadius: '999px',
          background: 'rgba(237, 233, 227, 0.08)',
          boxShadow: '0 0 18px var(--color-accent-glow)',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--color-accent)';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        title={label}
        type="button"
      />
    </Html>
  );
}
