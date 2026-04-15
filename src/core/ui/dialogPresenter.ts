import { create } from 'zustand'

export type DialogUiState = {
  title?: string
  message?: string
  positiveButton?: string
  negativeButton?: string
}

export type DialogResult = 'positive' | 'negative' | 'dismiss'

type DialogStore = {
  dialogState: DialogUiState | undefined
  requestDialog: (uiState: DialogUiState) => Promise<DialogResult>
  onPositive: () => void
  onNegative: () => void
  onDismiss: () => void
}

let pendingResolve: ((result: DialogResult) => void) | undefined

function resolve(result: DialogResult) {
  pendingResolve?.(result)
  pendingResolve = undefined
}

export const useDialogPresenter = create<DialogStore>((set) => ({
  dialogState: undefined,
  requestDialog: (uiState) => {
    return new Promise<DialogResult>((res) => {
      pendingResolve = res
      set({ dialogState: uiState })
    })
  },
  onPositive: () => {
    resolve('positive')
    set({ dialogState: undefined })
  },
  onNegative: () => {
    resolve('negative')
    set({ dialogState: undefined })
  },
  onDismiss: () => {
    resolve('dismiss')
    set({ dialogState: undefined })
  },
}))
