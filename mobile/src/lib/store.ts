import { create } from 'zustand';

interface AppState {
  role: "volunteer" | "coordinator" | null;
  appliedEvents: string[];
  setRole: (role: "volunteer" | "coordinator" | null) => void;
  applyForEvent: (eventId: string) => void;
  submitCoordinatorReport: (eventId: string) => void;
  submittedReports: string[];
}

export const useAppStore = create<AppState>((set) => ({
  role: null,
  appliedEvents: ["e3", "e12", "e1"], // Pre-seeded applications
  setRole: (role) => set({ role }),
  applyForEvent: (eventId) => set((state) => ({ 
    appliedEvents: [...state.appliedEvents, eventId] 
  })),
  submittedReports: [],
  submitCoordinatorReport: (eventId) => set((state) => ({
    submittedReports: [...state.submittedReports, eventId]
  }))
}));
