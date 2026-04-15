import { create } from 'zustand'

export type SnackbarUiState = {
  id: number
  message: string
  actionLabel?: string
}

type SnackbarStore = {
  snackbarState: SnackbarUiState | undefined
  _nextId: number
  show: (message: string, actionLabel?: string) => void
  hide: () => void
}

export const useSnackbarPresenter = create<SnackbarStore>((set, get) => ({
  snackbarState: undefined,
  _nextId: 0,
  show: (message, actionLabel) => {
    const id = get()._nextId + 1
    set({ _nextId: id, snackbarState: { id, message, actionLabel } })
    setTimeout(() => {
      const current = get().snackbarState
      if (current?.id === id) {
        set({ snackbarState: undefined })
      }
    }, 3000)
  },
  hide: () => set({ snackbarState: undefined }),
}))
