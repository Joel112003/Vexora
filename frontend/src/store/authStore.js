import { create } from "zustand";;

export const useAuthStore = create((set) => ({
    user : null , 
    accessToken : null,

    setAuth : (user , accessToken) => set({user , accessToken}),
    setAccessToken : (accessToken) => set({accessToken}),

    updateBalance : (balance) => set((state) => ({
        user : state.user ? {...state.user , balance} : null,

    })),

    logout : () => set({user : null , accessToken : null}),
}));