import { PreferenceKey, preferenceStorage } from '@/core/data/preferenceStorage'
import { useSessionStore } from '@/core/data/useSessionStore'
import { useSnackbarPresenter } from '@/core/ui/snackbarPresenter'
import { create } from 'zustand'

export type HomeEffect = { type: 'navigateToLogin' }

type HomeState = {
  savedEmail: string | undefined
  isRememberEmail: boolean
  effect: HomeEffect | undefined
}

type HomeActions = {
  init: () => Promise<void>
  toggleRememberEmail: () => Promise<void>
  onBack: () => void
  logout: () => void
  consumeEffect: () => void
}

export const useHomeStore = create<HomeState & HomeActions>((set, get) => ({
  savedEmail: undefined,
  isRememberEmail: false,
  effect: undefined,

  init: async () => {
    const savedEmail = await preferenceStorage.getOrNull<string>(PreferenceKey.Auth.SavedEmail)
    const isRememberEmail = await preferenceStorage.getOrDefault(
      PreferenceKey.Auth.RememberEmail,
      false,
    )
    set({ savedEmail: savedEmail ?? undefined, isRememberEmail })

    const { displayName } = useSessionStore.getState()
    setTimeout(() => {
      useSnackbarPresenter.getState().show(`Welcome, ${displayName}!`)
    }, 500)
  },

  toggleRememberEmail: async () => {
    const current = get().isRememberEmail
    const next = !current
    await preferenceStorage.put(PreferenceKey.Auth.RememberEmail, next)
    if (!next) {
      await preferenceStorage.remove(PreferenceKey.Auth.SavedEmail)
      set({ savedEmail: undefined })
    }
    set({ isRememberEmail: next })
  },

  onBack: () => {
    useSnackbarPresenter.getState().show('Use the Logout button to sign out')
  },

  logout: () => {
    useSessionStore.getState().clearSession()
    set({ effect: { type: 'navigateToLogin' } })
  },

  consumeEffect: () => set({ effect: undefined }),
}))
