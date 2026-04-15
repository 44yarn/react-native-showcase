import { create } from 'zustand'

type SessionState = {
  displayName: string
  isGuest: boolean
  setSession: (displayName: string, isGuest: boolean) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  displayName: '',
  isGuest: false,
  setSession: (displayName, isGuest) => set({ displayName, isGuest }),
  clearSession: () => set({ displayName: '', isGuest: false }),
}))
