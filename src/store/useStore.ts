import { create } from 'zustand';

type SidereusState = Record<string, never>;

export const useStore = create<SidereusState>(() => ({}));
