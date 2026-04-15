import { create } from 'zustand'

type IndicatorStore = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

export const useIndicatorState = create<IndicatorStore>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}))
