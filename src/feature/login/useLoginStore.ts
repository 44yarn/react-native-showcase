import { authRepository } from '@/core/data/authRepository'
import { create } from 'zustand'

export type LoginEffect = { type: 'navigateToHome' }

type LoginState = {
  email: string
  password: string
  isLoading: boolean
  error: string | undefined
  effect: LoginEffect | undefined
}

type LoginActions = {
  updateEmail: (email: string) => void
  updatePassword: (password: string) => void
  submit: () => Promise<void>
  consumeEffect: () => void
}

export const useLoginStore = create<LoginState & LoginActions>((set, get) => ({
  email: '',
  password: '',
  isLoading: false,
  error: undefined,
  effect: undefined,
  updateEmail: (email) => set({ email }),
  updatePassword: (password) => set({ password }),
  consumeEffect: () => set({ effect: undefined }),
  submit: async () => {
    set({ isLoading: true, error: undefined })
    const result = await authRepository.login(get().email, get().password)
    if (result.ok) {
      set({ effect: { type: 'navigateToHome' } })
    } else {
      set({ error: result.error.message })
    }
    set({ isLoading: false })
  },
}))
