import { create } from 'zustand';

interface SidereusState {
  /** Id of the currently focused planet, or null when none is focused. */
  focusedPlanetId: string | null;
  setFocusedPlanetId: (id: string | null) => void;

  /** Current simulation time in days since epoch. */
  simTimeDays: number;
  setSimTimeDays: (days: number) => void;

  /** Time scale: days per second of real time. */
  timeScale: number;
  setTimeScale: (scale: number) => void;

  /** Whether the simulation is paused. */
  paused: boolean;
  togglePaused: () => void;

  /** Reset simulation time to 0 and pause. */
  resetTime: () => void;
}

export const useStore = create<SidereusState>((set) => ({
  focusedPlanetId: null,
  setFocusedPlanetId: (id) => set({ focusedPlanetId: id }),

  simTimeDays: 0,
  setSimTimeDays: (days) => set({ simTimeDays: days }),

  timeScale: 30,
  setTimeScale: (scale) => set({ timeScale: scale }),

  paused: false,
  togglePaused: () => set((state) => ({ paused: !state.paused })),

  resetTime: () => set({ simTimeDays: 0, paused: true, timeScale: 30 }),
}));
