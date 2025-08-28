import { create } from "zustand";

interface AuthState {
  user: null | {  email: string, id:string };
  login: (user: { email: string, id:string}) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

