import { create } from 'zustand';

interface SidereusState {
  /** Id of the currently focused planet, or null when none is focused. */
  focusedPlanetId: string | null;
  setFocusedPlanetId: (id: string | null) => void;
}

export const useStore = create<SidereusState>((set) => ({
  focusedPlanetId: null,
  setFocusedPlanetId: (id) => set({ focusedPlanetId: id }),
}));
