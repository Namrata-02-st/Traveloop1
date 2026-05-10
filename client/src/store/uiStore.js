import { create } from 'zustand';

const useUiStore = create((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen })
}));

export default useUiStore;
