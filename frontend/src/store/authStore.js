import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isHydrating: true, 

  setAuth: (user, accessToken) => set({ user, accessToken, isHydrating: false }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setHydrating: (isHydrating) => set({ isHydrating }),

  updateBalance: (balance) =>
    set((state) => ({
      user: state.user ? { ...state.user, balance } : null,
    })),

  logout: () => set({ user: null, accessToken: null, isHydrating: false }),
}));
