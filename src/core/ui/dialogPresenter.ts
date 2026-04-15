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
  _resolve: ((result: DialogResult) => void) | undefined
  requestDialog: (uiState: DialogUiState) => Promise<DialogResult>
  onPositive: () => void
  onNegative: () => void
  onDismiss: () => void
}

export const useDialogPresenter = create<DialogStore>((set, get) => ({
  dialogState: undefined,
  _resolve: undefined,
  requestDialog: (uiState) => {
    return new Promise<DialogResult>((resolve) => {
      set({ dialogState: uiState, _resolve: resolve })
    })
  },
  onPositive: () => {
    get()._resolve?.('positive')
    set({ dialogState: undefined, _resolve: undefined })
  },
  onNegative: () => {
    get()._resolve?.('negative')
    set({ dialogState: undefined, _resolve: undefined })
  },
  onDismiss: () => {
    get()._resolve?.('dismiss')
    set({ dialogState: undefined, _resolve: undefined })
  },
}))
