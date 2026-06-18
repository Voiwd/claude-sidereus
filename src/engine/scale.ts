// Engine scale: maps physical solar-system measurements to Three.js scene units (u).
// All SCREAMING_SNAKE_CASE constants below are the only values to change when
// adjusting visual feel. Never hard-code these in component files.
// See docs/engine-scale.md for the design rationale behind each system.

// ── System 1: Body radii ─────────────────────────────────────────────────────
// Linear: radius_u = radiusKm × BODY_SCALE_KM_TO_U
// Single factor for ALL bodies (Sol, planets, moons) — real size ratios preserved.
// Sol ≈ 55.7u  Jupiter ≈ 5.59u  Earth ≈ 0.51u  Moon ≈ 0.14u (27% of Earth ✓)
export const BODY_SCALE_KM_TO_U = 8e-5;
// Floor so bodies smaller than Phobos don't vanish below a pixel.
export const MIN_BODY_RADIUS_U = 0.06;

// ── System 2: Heliocentric orbital distances ──────────────────────────────────
// Linear: distance_u = semiMajorAxisAU × AU_TO_U
// 200 chosen so Mercury's orbit (77.4u) clears Sol's surface (55.7u) by 21.7u.
export const AU_TO_U = 200;

// ── System 3: Moon orbital distances ─────────────────────────────────────────
// Same factor as body radii so the Moon-to-Earth distance ratio is real (~60× Rearth).
// Earth's Moon: 384 400 km × 8e-5 = 30.75u.  Phobos: 9 376 km × 8e-5 = 0.75u.
export const MOON_ORBIT_KM_TO_U = BODY_SCALE_KM_TO_U;
// Floor prevents tight-orbit moons (Phobos real ≈ 0.75u) from clipping inside Mars.
export const MIN_MOON_ORBIT_U = 1.5;

// ── Camera ────────────────────────────────────────────────────────────────────
// Focus distance = bodyRadius × CAMERA_FOCUS_MULTIPLIER, so the camera sits
// proportionally outside the focused body regardless of its scale.
export const CAMERA_FOCUS_MULTIPLIER = 3.5;
export const MIN_FOCUS_DISTANCE_U = 4;

// ── Starfield ─────────────────────────────────────────────────────────────────
// Stars sphere must enclose the entire solar system (Neptune orbit ≈ 6014u).
export const STARFIELD_RADIUS_U = 8000;

// ─────────────────────────────────────────────────────────────────────────────

export function auToScene(au: number): number {
  return au * AU_TO_U;
}

export function bodyRadiusToScene(km: number): number {
  return Math.max(km * BODY_SCALE_KM_TO_U, MIN_BODY_RADIUS_U);
}

export function moonOrbitToScene(km: number): number {
  return Math.max(km * MOON_ORBIT_KM_TO_U, MIN_MOON_ORBIT_U);
}

export function focusDistanceForBody(km: number): number {
  return Math.max(
    bodyRadiusToScene(km) * CAMERA_FOCUS_MULTIPLIER,
    MIN_FOCUS_DISTANCE_U
  );
}
