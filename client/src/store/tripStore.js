import { create } from 'zustand';

const useTripStore = create((set) => ({
  trips: [],
  activeTrip: null,
  budgetVersion: 0,
  setTrips: (trips) => set({ trips }),
  setActiveTrip: (activeTrip) => set({ activeTrip }),
  touchBudget: () => set((state) => ({ budgetVersion: state.budgetVersion + 1 }))
}));

export default useTripStore;
