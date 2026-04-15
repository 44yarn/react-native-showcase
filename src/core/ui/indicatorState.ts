import type { Result } from '@/core/foundation/result'
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

export async function runWithLoading<T>(fn: () => Promise<Result<T>>): Promise<Result<T>> {
  const { startLoading, stopLoading } = useIndicatorState.getState()
  startLoading()
  try {
    return await fn()
  } finally {
    stopLoading()
  }
}
