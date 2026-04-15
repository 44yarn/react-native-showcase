import { ERROR_PASSWORD, SAMPLE_EMAILS, authRepository } from '@/core/data/authRepository'
import { PreferenceKey, preferenceStorage } from '@/core/data/preferenceStorage'
import { useSessionStore } from '@/core/data/useSessionStore'
import { useDialogPresenter } from '@/core/ui/dialogPresenter'
import { runWithLoading } from '@/core/ui/indicatorState'
import { create } from 'zustand'

export type LoginEffect = { type: 'navigateToHome' } | { type: 'navigateToInfo' }

type LoginState = {
  email: string
  password: string
  isPasswordVisible: boolean
  error: string | undefined
  effect: LoginEffect | undefined
}

type LoginActions = {
  init: () => Promise<void>
  updateEmail: (email: string) => void
  updatePassword: (password: string) => void
  togglePasswordVisibility: () => void
  setRandomEmail: () => void
  setDemoFailure: () => void
  submit: () => Promise<void>
  navigateToInfo: () => void
  consumeEffect: () => void
}

export const useLoginStore = create<LoginState & LoginActions>((set, get) => ({
  email: 'demo@example.com',
  password: 'password',
  isPasswordVisible: false,
  error: undefined,
  effect: undefined,

  init: async () => {
    const savedEmail = await preferenceStorage.getOrNull<string>(PreferenceKey.Auth.SavedEmail)
    if (savedEmail) {
      set({ email: savedEmail })
    }
  },

  updateEmail: (email) => set({ email }),
  updatePassword: (password) => set({ password }),
  togglePasswordVisibility: () => set((s) => ({ isPasswordVisible: !s.isPasswordVisible })),

  setRandomEmail: () => {
    const random = SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)]
    set({ email: random })
  },

  setDemoFailure: async () => {
    const previousPassword = get().password
    set({ password: ERROR_PASSWORD })
    await get().submit()
    set({ password: previousPassword })
  },

  navigateToInfo: () => {
    set({ effect: { type: 'navigateToInfo' } })
  },

  consumeEffect: () => set({ effect: undefined }),

  submit: async () => {
    set({ error: undefined })
    const { email, password } = get()

    const result = await runWithLoading(() => authRepository.login(email, password))

    if (result.ok) {
      const rememberEmail = await preferenceStorage.getOrDefault(
        PreferenceKey.Auth.RememberEmail,
        true,
      )
      if (rememberEmail) {
        await preferenceStorage.put(PreferenceKey.Auth.SavedEmail, email)
      }
      useSessionStore.getState().setSession(result.value.displayName, false)
      set({ effect: { type: 'navigateToHome' } })
    } else {
      const dialogResult = await useDialogPresenter.getState().requestDialog({
        title: 'Login Failed',
        message: result.error.message,
        positiveButton: 'Guest Login',
        negativeButton: 'Cancel',
      })
      if (dialogResult === 'positive') {
        useSessionStore.getState().setSession('Guest', true)
        set({ effect: { type: 'navigateToHome' } })
      }
    }
  },
}))
