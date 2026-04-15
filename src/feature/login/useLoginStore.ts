import { ERROR_PASSWORD, SAMPLE_EMAILS, authRepository } from '@/core/data/authRepository'
import { PreferenceKey, preferenceStorage } from '@/core/data/preferenceStorage'
import { useSessionStore } from '@/core/data/useSessionStore'
import { t } from '@/core/i18n'
import { useDialogPresenter } from '@/core/ui/dialogPresenter'
import { runWithLoading } from '@/core/ui/indicatorState'
import { useIndicatorState } from '@/core/ui/indicatorState'
import { create } from 'zustand'

function computeLoginEnabled(email: string, password: string): boolean {
  return (
    email.trim().length > 0 && password.trim().length > 0 && !useIndicatorState.getState().isLoading
  )
}

export type LoginEffect = { type: 'navigateToHome' } | { type: 'navigateToInfo' }

type LoginState = {
  _initialized: boolean
  email: string
  password: string
  isPasswordVisible: boolean
  isLoginEnabled: boolean
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
  _initialized: false,
  email: 'demo@example.com',
  password: 'password',
  isPasswordVisible: false,
  isLoginEnabled: true,
  error: undefined,
  effect: undefined,

  init: async () => {
    if (get()._initialized) return
    set({ _initialized: true })
    const savedEmail = await preferenceStorage.getOrNull<string>(PreferenceKey.Auth.SavedEmail)
    if (savedEmail) {
      set({ email: savedEmail, isLoginEnabled: computeLoginEnabled(savedEmail, get().password) })
    }
  },

  updateEmail: (email) =>
    set({ email, isLoginEnabled: computeLoginEnabled(email, get().password) }),
  updatePassword: (password) =>
    set({ password, isLoginEnabled: computeLoginEnabled(get().email, password) }),
  togglePasswordVisibility: () => set((s) => ({ isPasswordVisible: !s.isPasswordVisible })),

  setRandomEmail: () => {
    const current = get().email
    const candidates = SAMPLE_EMAILS.filter((e) => e !== current)
    const random = candidates[Math.floor(Math.random() * candidates.length)]
    set({ email: random, isLoginEnabled: computeLoginEnabled(random, get().password) })
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
        title: t('login.failedTitle'),
        message: result.error.message,
        positiveButton: t('login.guestLogin'),
        negativeButton: t('login.cancel'),
      })
      if (dialogResult === 'positive') {
        useSessionStore.getState().setSession('Guest', true)
        set({ effect: { type: 'navigateToHome' } })
      }
    }
  },
}))
