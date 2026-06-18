# Engine Scale Reference

Three independent systems map physical solar-system measurements to Three.js scene units (u).
All tunable values are exported as named constants from `src/engine/scale.ts` — change them
there; never hard-code numbers in component files.

---

## System 1 — Body radii: linear, universal

```
radius_u = radiusKm × BODY_SCALE_KM_TO_U
```

One factor for **all** bodies (Sol, planets, moons). Real size ratios are preserved exactly.

| Body | Real radius (km) | Scene radius (u) |
|---|---|---|
| Sol | 696 340 | 55.71 |
| Jupiter | 69 911 | 5.59 |
| Saturn | 58 232 | 4.66 |
| Earth | 6 371 | 0.51 |
| Moon (Lua) | 1 737 | 0.14 — 27% of Earth ✓ |
| Phobos | 11.3 | 0.06 (clamped by MIN_BODY_RADIUS_U) |

`MIN_BODY_RADIUS_U` is a visibility floor — bodies below it would vanish below a pixel.
It does **not** apply to large bodies; only Phobos/Deimos-class objects are clamped.

---

## System 2 — Heliocentric orbital distances: linear

```
distance_u = semiMajorAxisAU × AU_TO_U
```

| Body | Orbit (AU) | Scene distance (u) |
|---|---|---|
| Mercury | 0.387 | 77.4 |
| Venus | 0.723 | 144.6 |
| Earth | 1.000 | 200 |
| Mars | 1.524 | 304.8 |
| Jupiter | 5.203 | 1 040.6 |
| Saturn | 9.537 | 1 907.4 |
| Uranus | 19.19 | 3 838 |
| Neptune | 30.07 | 6 014 |

`AU_TO_U = 200` was chosen so Mercury's orbit (77.4u) clears Sol's surface (55.7u) with a
21.7u gap. Any value below ~144 would push Mercury inside Sol.

---

## System 3 — Moon orbital distances: same linear factor

```
moonOrbit_u = semiMajorAxisKm × MOON_ORBIT_KM_TO_U   (= BODY_SCALE_KM_TO_U)
```

Same factor as body radii, so Moon-to-Earth distance ratio matches reality (~60× Earth radii).

| Moon | Real orbit (km) | Scene orbit (u) |
|---|---|---|
| Phobos | 9 376 | 1.5 (clamped by MIN_MOON_ORBIT_U) |
| Moon (Lua) | 384 400 | 30.75 |
| Ganymede | 1 070 400 | 85.6 |
| Titan | 1 221 870 | 97.7 |

`MIN_MOON_ORBIT_U = 1.5` prevents moons in tight orbits (Phobos real ≈ 0.75u) from clipping
inside their parent planet.

---

## System 4 — Translation speed (orbital period → angular velocity)

```
ω = 2π / orbitalPeriodDays   [rad / sim-day]
t_sim += Δt_s × timeScale    [sim-days / real-second at timeScale=1]
```

At `timeScale = 365`, Earth completes one orbit per real second.
Pausing sets `Δt = 0`; no accumulated drift.

---

## System 5 — Rotation speed

```
θ(t) = rotDir × (t_days × 24 / |rotationPeriodHours|) × 2π
```

Derived from absolute simulation time — not accumulated — so pause/reset is exact and
`timeScale` changes take effect immediately.

---

## Exported Tweaks (`src/engine/scale.ts`)

| Constant | Default | Role |
|---|---|---|
| `BODY_SCALE_KM_TO_U` | `8e-5` | Linear radius factor (all bodies) |
| `MIN_BODY_RADIUS_U` | `0.06` | Minimum visible sphere radius |
| `AU_TO_U` | `200` | AU → scene units (heliocentric orbits) |
| `MOON_ORBIT_KM_TO_U` | `8e-5` | Linear moon orbit factor (= body scale) |
| `MIN_MOON_ORBIT_U` | `1.5` | Minimum moon orbit radius |
| `CAMERA_FOCUS_MULTIPLIER` | `3.5` | Camera sits at this × body_radius from center |
| `MIN_FOCUS_DISTANCE_U` | `4` | Minimum focus distance (keeps camera off Sol surface) |
| `STARFIELD_RADIUS_U` | `8000` | Background stars sphere radius (> Neptune orbit 6014u) |
