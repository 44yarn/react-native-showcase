import { create } from 'zustand'

export type SnackbarUiState = {
  id: number
  message: string
  actionLabel?: string
}

type SnackbarStore = {
  snackbarState: SnackbarUiState | undefined
  show: (message: string, actionLabel?: string) => void
  hide: () => void
}

let nextId = 0

export const useSnackbarPresenter = create<SnackbarStore>((set, get) => ({
  snackbarState: undefined,
  show: (message, actionLabel) => {
    const id = ++nextId
    set({ snackbarState: { id, message, actionLabel } })
    setTimeout(() => {
      const current = get().snackbarState
      if (current?.id === id) {
        set({ snackbarState: undefined })
      }
    }, 3000)
  },
  hide: () => set({ snackbarState: undefined }),
}))
