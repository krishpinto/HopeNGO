import { create } from 'zustand';

interface AppState {
  appliedEvents: string[]; // Stores event IDs the volunteer has applied to
  applyToEvent: (eventId: string) => void;
  hasApplied: (eventId: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  appliedEvents: ["e3", "e12"], // Assume user applied to these previously
  applyToEvent: (eventId: string) => {
    set((state) => ({
      appliedEvents: [...state.appliedEvents, eventId]
    }));
  },
  hasApplied: (eventId: string) => {
    return get().appliedEvents.includes(eventId);
  }
}));
