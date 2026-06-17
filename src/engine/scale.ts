// Render scale system: maps real-world solar system measurements to scene units.
// Distances and radii use separate scales to keep all bodies visible.

// Orbital distance scale: 1 AU = 10 scene units.
// Neptune (~30 AU) maps to ~300 scene units.
export const AU_UNIT = 10;

// Body radius scale: power-law to compress 6 orders of magnitude.
// radiusToScene(km) = BODY_K * km^BODY_EXP, clamped to MIN_BODY_RADIUS.
// This preserves relative ordering while making tiny bodies visible.
// Example outputs: Sun ~14.8, Jupiter ~5.6, Earth ~1.8, Moon ~0.97, Phobos ~0.15(min)
const BODY_K = 0.035;
const BODY_EXP = 0.45;
export const MIN_BODY_RADIUS = 0.15;

// Moon orbital scale: power-law on km, clamped to MIN_MOON_ORBIT.
// Scales independently of planet distance to keep moons visible.
// Example outputs: Moon ~8.0, Titan ~15.7, Callisto ~18.8, Phobos ~2.5(min)
const MOON_K = 0.007;
const MOON_EXP = 0.55;
export const MIN_MOON_ORBIT = 2.5;

export function auToScene(au: number): number {
  return au * AU_UNIT;
}

export function radiusToScene(km: number): number {
  return Math.max(BODY_K * Math.pow(km, BODY_EXP), MIN_BODY_RADIUS);
}

export function moonOrbitToScene(km: number): number {
  return Math.max(MOON_K * Math.pow(km, MOON_EXP), MIN_MOON_ORBIT);
}

// Camera focus distance for a body given its km radius.
export function focusDistanceForRadius(km: number): number {
  return Math.max(radiusToScene(km) * 3.5, 4);
}
