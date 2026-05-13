import { create } from 'zustand';

type SidereusState = object;

export const useStore = create<SidereusState>(() => ({}));
