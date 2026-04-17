import { ERROR_PASSWORD, SAMPLE_EMAILS, authRepository } from '@/core/data/authRepository'
import { PreferenceKey, preferenceStorage } from '@/core/data/preferenceStorage'
import { useSessionStore } from '@/core/data/useSessionStore'
import { t } from '@/core/i18n'
import { useDialogPresenter } from '@/core/ui/dialogPresenter'
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
  setDemoFailure: () => Promise<void>
  submit: (overridePassword?: string) => Promise<void>
  cancelLogin: () => void
  navigateToInfo: () => void
  consumeEffect: () => void
  reset: () => void
}

let abortController: AbortController | undefined

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
    // reset() が await 中に呼ばれた場合はスキップ
    if (!get()._initialized) return
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

  // Demo: state を汚染せず ERROR_PASSWORD を直接渡して失敗を再現
  setDemoFailure: async () => {
    await get().submit(ERROR_PASSWORD)
  },

  navigateToInfo: () => {
    set({ effect: { type: 'navigateToInfo' } })
  },

  consumeEffect: () => set({ effect: undefined }),

  reset: () => {
    abortController?.abort()
    abortController = undefined
    useIndicatorState.getState().stopLoading()
    set({
      _initialized: false,
      email: 'demo@example.com',
      password: 'password',
      isPasswordVisible: false,
      isLoginEnabled: true,
      error: undefined,
      effect: undefined,
    })
  },

  cancelLogin: () => {
    abortController?.abort()
    abortController = undefined
    useIndicatorState.getState().stopLoading()
    set({ isLoginEnabled: computeLoginEnabled(get().email, get().password) })
  },

  submit: async (overridePassword?: string) => {
    // 二重送信防止: submit 開始時に無効化
    set({ error: undefined, isLoginEnabled: false })
    const { email } = get()
    const password = overridePassword ?? get().password

    abortController = new AbortController()
    const { signal } = abortController

    useIndicatorState.getState().startLoading()
    const result = await authRepository.login(email, password)

    if (signal.aborted) return
    useIndicatorState.getState().stopLoading()

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
      if (signal.aborted) return
      if (dialogResult === 'positive') {
        useSessionStore.getState().setSession('Guest', true)
        set({ effect: { type: 'navigateToHome' } })
      }
    }

    abortController = undefined
    // 送信完了後に isLoginEnabled を再計算して復元
    set({ isLoginEnabled: computeLoginEnabled(get().email, get().password) })
  },
}))
